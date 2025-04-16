import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { menuService } from '../../api/services/menuService';
import { favoritedService } from '../../api/services/favoritedService';
import { authuserService } from '../../api/services/authuserService';
import { FontAwesome } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import FoodImageModal from '@/components/FoodModal';

const foodQuery = () => {
  const [food, setFood] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);
  const [_netid, setNetid] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await menuService.getMenu();
        const user = await authuserService.getCurrentUser();
        setNetid(user.netid);

        const favoritedResponse = await favoritedService.getFavorited(user.netid);
        const favoritedFoodIds = favoritedResponse.favoriteFoods.map(
          (item: { foodid: number }) => item.foodid
        );

        // Fetch image URLs
        const imageResponse = await menuService.getImageUrls();
        const imageMap = imageResponse.images.reduce(
          (acc: Record<number, string>, item: { foodid: number; imageUrl: string }) => {
            acc[item.foodid] = item.imageUrl;
            return acc;
          },
          {}
        );

        // Merge image URLs with food data
        const foodWithImages = response.menu.map((item: FoodItem) => ({
          ...item,
          isFavorited: favoritedFoodIds.includes(item.foodid),
          imageUrl: imageMap[item.foodid] || "",
        }));

        setFood(foodWithImages);
        setFilteredFood(foodWithImages);
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
    if (!_netid) return;

    try {
      const updatedFood = food.map(foodItem =>
        foodItem.foodid === item.foodid
          ? { ...foodItem, isFavorited: !foodItem.isFavorited }
          : foodItem
      );
      setFood(updatedFood);
      setFilteredFood(updatedFood);

      if (!item.isFavorited) {
        await favoritedService.postFavorited({
          netid: _netid,
          foodid: item.foodid,
          food: item.food,
          dininghallid: 1,
        });
      } else {
        await favoritedService.deleteFavorited(_netid, item.foodid);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');

  const handleFoodImagePress = (foodId: number, food: string) => {
    menuService
      .getFoodImage(foodId)
      .then((response) => {
        if (response.image) {
          setSelectedImage(response.image);
        } else {
          setSelectedImage(null);
        }
        setFoodName(food);
        setModalVisible(true);
      })
      .catch((error) => {
        console.error('Error fetching food image:', error);
        setSelectedImage(null);
        setModalVisible(true);
      });
  };

  return (
    <View style={styles.container}>

      {/* Header with Search Title and Report Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://forms.office.com/Pages/ResponsePage.aspx?id=fqjxFyUqqk65351DkDSwgPRVHJJt2T1NrjqsP78_6B1URVNVV0tZWVVYQUtTWlM3VzFETVo5R00wOS4u')
          }
          style={styles.reportButton}
        >
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
        <Text style={styles.header}>🔍 Search Food 🔍</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Food List */}
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredFood}
          keyExtractor={(item) => item.foodid.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                router.push({
                  pathname: '../nutritional',
                  params: { foodid: item.foodid },
                })
              }
            >
              <Text style={styles.foodText}>{item.food}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => handleFoodImagePress(item.foodid, item.food)}
                  style={styles.imageButton}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <FontAwesome name="image" size={40} color="gray" />
                  )}
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
          foodName={foodName}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          imageUri={selectedImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F54',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    marginBottom: 16,
  },
  reportButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 10,
  },
  reportText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  searchWrapper: {
    paddingBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
  },
  foodText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
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
