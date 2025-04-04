import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { menuService } from '@/api/services/menuService';
import { favoritedService } from '@/api/services/favoritedService';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import FoodImageModal from '@/components/FoodModal';

const foodQuery = () => {
  const [food, setFood] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        console.log('Fetching food data...');
        const response = await menuService.getMenu();
        console.log('Food data fetched:', response.menu);

        // fetch favorited foods
        const favoritedResponse = await favoritedService.getFavorited('jas20060'); // replace with actual netid
        const favoritedFoodIds = favoritedResponse.favoriteFoods.map((item: { foodid: number }) => item.foodid);

        // map through the menu and add isFavorited property
        const foodWithFavorites = response.menu.map((item: FoodItem) => ({
          ...item,
          isFavorited: favoritedFoodIds.includes(item.foodid)
        }));
        setFood(foodWithFavorites);
        setFilteredFood(foodWithFavorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFood();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = food.filter(item =>
        item.food.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFood(filtered);
    } else {
      setFilteredFood(food);
    }
  }, [searchQuery, food]);

  const toggleFavorite = async (item: FoodItem) => {
    try {
      const updatedFood = food.map(foodItem =>
        foodItem.foodid === item.foodid
          ? { ...foodItem, isFavorited: !foodItem.isFavorited }
          : foodItem
      );
      setFood(updatedFood);
      setFilteredFood(updatedFood);

      // Update the favorite status in the database
      if (!item.isFavorited) {
        await favoritedService.postFavorited({
          netid: 'jas20060', // replace with actual netid
          foodid: item.foodid,
          food: item.food,
          dininghallid: 1
        });
      } else {
        await favoritedService.deleteFavorited('jas20060', item.foodid); // replace with actual netid
      }
    } catch (error) {
      console.error(error);
    }
  };

  // State for modal visibility and selected image
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFoodImagePress = (foodId: number) => {
    menuService
      .getFoodImage(foodId)
      .then((response) => {
        if (response.image) {
          setSelectedImage(response.image); // Set the selected image
        } else {
          setSelectedImage(null); // No image available
        }
        setModalVisible(true); // Open the modal
      })
      .catch((error) => {
        console.error('Error fetching food image:', error);
        setSelectedImage(null); // Handle error by setting no image
        setModalVisible(true); // Open the modal even if there's no image
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Query</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFood}
        keyExtractor={(item) => item.foodid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => {
            // navigate to nutrional page
            router.push({
              pathname: "../nutritional",
              params: { foodid: item.foodid },
            });

          }}>
            <Text style={styles.foodText}>{item.food}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => handleFoodImagePress(item.foodid)}
                  style={styles.imageButton}
                >
                  <FontAwesome name="image" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.icon}>
                  <FontAwesome
                    name={item.isFavorited ? 'star' : 'star-o'}
                    size={24}
                    color={item.isFavorited ? 'gold' : 'gray'}
                  />
                </TouchableOpacity>
                </View>
          </TouchableOpacity>
        )}
      />
      
      <FoodImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        imageUri={selectedImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodText: {
    fontSize: 18,
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButton: {
    marginRight: 10,
  },
});

export default foodQuery;