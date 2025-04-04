import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { menuService } from '../api/services/menuService';
import { favoritedService } from '../api/services/favoritedService';
import { authuserService } from '../api/services/authuserService';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const foodQuery = () => {
  const [food, setFood] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);
  const [_netid, setNetid] = useState<string | null>(null);

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

        const foodWithFavorites = response.menu.map((item: FoodItem) => ({
          ...item,
          isFavorited: favoritedFoodIds.includes(item.foodid),
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

  return (
    <View style={styles.container}>

      {/* Header with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/dining')} style={styles.backIcon}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.header}>🔍 Search Food 🔍</Text>
        </View>
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
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <FontAwesome
                name={item.isFavorited ? 'star' : 'star-o'}
                size={24}
                color={item.isFavorited ? 'gold' : '#ccc'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
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
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchInput: {
    height: 48, // matches item height
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
});

export default foodQuery;
