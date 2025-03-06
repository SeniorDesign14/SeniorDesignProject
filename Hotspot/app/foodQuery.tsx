import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { menuService } from '@/api/services/menuService';
import { favoritedService } from '@/api/services/favoritedService';
import { FontAwesome } from '@expo/vector-icons';

interface FoodItem {
  foodid: number;
  food: string;
  isFavorited: boolean;
}

const foodQuery = () => {
  const [food, setFood] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await menuService.getMenu();
        const foodWithFavorites = response.menu.map((item: FoodItem) => ({
          ...item,
          isFavorited: false, // Initialize all items as not favorited
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
        // await favoritedService.postFavorited(item.foodid);
      } else {
        // await favoritedService.removeFavorited(item.foodid);
      }
    } catch (error) {
      console.error(error);
    }
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
          <View style={styles.item}>
            <Text style={styles.foodText}>{item.food}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <FontAwesome
                name={item.isFavorited ? 'star' : 'star-o'}
                size={24}
                color={item.isFavorited ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        )}
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
});

export default foodQuery;