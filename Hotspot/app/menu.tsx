import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { scheduleService } from '@/api/services/scheduleService';
import { format } from 'date-fns';
import { TabBar, TabView } from 'react-native-tab-view';
import { FontAwesome } from '@expo/vector-icons';
import { favoritedService } from '@/api/services/favoritedService';
import { menuService } from '@/api/services/menuService';
import FoodImageModal from '@/components/FoodModal';


// converts datestring from "yyyy-MM-dd" to "Tuesday, Mar 13"
const formatToTextDate = (datestring: string) => {
  const date = new Date(datestring + "T00:00:00");
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const menu = () => {
  // grab name and id from dining.tsx (from DiningItem component)
  const { name, id, mealPeriod, selectedDate } = useLocalSearchParams() as { name: string; id: string; mealPeriod: string; selectedDate?: string, };
  const navigation = useNavigation();
  
  // Convert selectedDate to proper format or use current date if not provided
  const formattedDate = selectedDate ? selectedDate : format(new Date(), 'yyyy-MM-dd');

  useLayoutEffect(() => {
    if (name) {
      navigation.setOptions({ title: name }); // Set the screen title to the "name"
    }
  }, [name, navigation]);

  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [routes] = useState([
    { key: 'breakfast', title: 'Breakfast' },
    { key: 'lunch', title: 'Lunch' },
    { key: 'dinner', title: 'Dinner' },
  ]);

  // Set initial tab index based from dining screen mealPeriod (breakfast, lunch, dinner)
  const initialIndex = routes.findIndex(route => route.key === mealPeriod.toLowerCase());
  const [index, setIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  
  // Fetch dining hall data on component mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // get the schedule
        const response = await scheduleService.getSchedule(id, formattedDate);

        // fetch favorited foods
        const favoritedResponse = await favoritedService.getFavorited('jas20060'); // replace with actual netid
        const favoritedFoodIds = favoritedResponse.favoriteFoods.map((item: { foodid: number }) => item.foodid);

        // map through the schedule and add isFavorited property
        const scheduleWithFavorites = response.schedule.map((item: Schedule) => ({
          ...item,
          isFavorited: favoritedFoodIds.includes(item.foodid)
        }));
        setSchedule(scheduleWithFavorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedule();
  }, [id, formattedDate]);

  // Get meals based on current mealPeriod (breakfast, lunch, dinner) and sort into dictionary by dining station name
  const getMeals = (mealP: string) => {
    let filterMeals: { [key: string]: FoodItem[] } = {};
    const meals = schedule.filter(item => item[`is${mealP.toLowerCase()}` as keyof Schedule]);
    meals.forEach(item => {
      if (filterMeals[item.station.stationname]) {
        filterMeals[item.station.stationname].push({ foodid: item.foodid, food: item.food, isFavorited: item.isFavorited, allergens: item.allergens });
      } else {
        filterMeals[item.station.stationname] = [{ foodid: item.foodid, food: item.food, isFavorited: item.isFavorited, allergens: item.allergens }];
      }
    });
    return filterMeals;
  };

  const toggleFavorite = async (item: FoodItem) => {
      try {
        const updatedFood = schedule.map(scheduleItem =>
          scheduleItem.foodid === item.foodid
            ? { ...scheduleItem, isFavorited: !scheduleItem.isFavorited }
            : scheduleItem
        );
        setSchedule(updatedFood);
  
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

  const renderScene = ({ route }: { route: { key: string } }) => {
    const mealP = route.key;
    const meals = getMeals(mealP);

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.date}>{formatToTextDate(formattedDate)}</Text>

        {Object.entries(meals).map(([station, foods], index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.stationName}>{station}</Text>
            <FlatList
              data={foods}
              keyExtractor={(item, idx) => `${station}-${idx}`}
              renderItem={({ item }: { item: FoodItem }) => (
                <TouchableOpacity style={styles.menuItem} onPress={ () => {
                  router.push({
                    pathname: "../nutritional",
                    params: { foodid: item.foodid, allergens: item.allergens },
                  }); // Add navigation to nutritional page
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
          </View>
        ))}
      </ScrollView>
    );
};

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            activeColor="white"
            inactiveColor="gray"
            indicatorStyle={{ backgroundColor: '#001F54', height: '100%', borderRadius: 10 }}
            style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}
          />
        )}
      />

      {/* Modal to display the food image */}
      <FoodImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        imageUri={selectedImage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001F54', // Dark blue to match the theme
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 8,
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001F54', // Dark blue to match the theme
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light gray separator
    backgroundColor: '#f9f9f9', // Slightly off-white for contrast
    borderRadius: 5, // Rounded edges for a softer UI
    marginVertical: 0, // Space between items
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  imageButton: {
    marginRight: 10,
  },
});


export default menu