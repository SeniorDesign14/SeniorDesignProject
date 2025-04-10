import { View, Text, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { favoritedService } from '../api/services/favoritedService';
import { authuserService } from '../api/services/authuserService';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { menuService } from '@/api/services/menuService';
import FoodImageModal from '@/components/FoodModal';


const Favorited = () => {
  const [favoritedFood, setFavorited] = useState<FoodItem[]>([]);
  const [userNetid, setUserNetid] = useState<string | null>(null);

  const navigation = useNavigation();


  useEffect(() => {
    const fetchFavorited = async () => {
      try {
        const user = await authuserService.getCurrentUser();
        setUserNetid(user.netid);

        const response = await favoritedService.getFavorited(user.netid);

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
        const foodWithImages = response.favoriteFoods.map((item: FoodItem) => ({
          ...item,
          isFavorited: true,
          imageUrl: imageMap[item.foodid] || "", // Add imageUrl or null if not available
        }));
        
        setFavorited(foodWithImages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorited();
  }, []);

  const toggleFavorite = async (item: FoodItem) => {
    if (!userNetid) return;

    // all items are already favorited, so we just need to remove it if this is triggered
    try {
      // remove item from state
      const updatedFood = favoritedFood.filter(foodItem => foodItem.foodid !== item.foodid);
      setFavorited(updatedFood);

      await favoritedService.deleteFavorited(userNetid, item.foodid);
    } catch (error) {
      console.error(error);
    }
  };

  // State for modal visibility and selected image
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');

  const handleFoodImagePress = (foodId: number, food: string) => {
      menuService
        .getFoodImage(foodId)
        .then((response) => {
          if (response.image) {
            setSelectedImage(response.image); // Set the selected image
          } else {
            setSelectedImage(null); // No image available
          }
          setFoodName(food); // Set the food name
          setModalVisible(true); // Open the modal
        })
        .catch((error) => {
          console.error('Error fetching food image:', error);
          setSelectedImage(null); // Handle error by setting no image
          setModalVisible(true); // Open the modal even if there's no image
        });
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>⭐ Your Favorited Foods ⭐</Text>
        <Text style={styles.subText}>
            NetID: <Text style={{ fontWeight: '600' }}>{userNetid ?? 'Loading...'}</Text>
        </Text>
      </View>

      <FlatList
        data={favoritedFood}
        keyExtractor={(item) => item.foodid.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't favorited any foods yet.</Text>
        }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F54', // dark blue background to match header
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // or use marginRight for spacing
  },  
  header: {
    backgroundColor: '#001F54',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,        // adds blue gap on left/right
    paddingTop: 16,
    paddingHorizontal: 12,
    flexGrow: 1,
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
  foodText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
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

export default Favorited;
