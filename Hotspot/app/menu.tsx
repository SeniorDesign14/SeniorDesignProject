import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { scheduleService } from '@/api/services/scheduleService';
import { format } from 'date-fns';
import { TabBar, TabView } from 'react-native-tab-view';


// Interface for dining hall data
interface Schedule {
  scheduleid: number,
  scheduledate: string,
  foodid: number,
  food: string,
  isbreakfast: boolean,
  islunch: boolean,
  isdinner: boolean,
  allergens: string,
  summary: null,
  imagelink: null,
  diningstationid: number,
  dininghallid: number,
  station: {
    diningstationid: number,
    dininghallid: number,
    stationname: string
  }
}

// Identify date - now used inside method
// const date = new Date();
// // const formattedDate: string = format(date, 'yyyy-MM-dd');

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
        const response = await scheduleService.getSchedule(id, formattedDate);
        setSchedule(response.schedule);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedule();
  }, [id, formattedDate]);

  // Get meals based on current mealPeriod (breakfast, lunch, dinner) and sort into dictionary by dining station name
  const getMeals = (mealP: string) => {
    let filterMeals: { [key: string]: Schedule['food'][] } = {};
    const meals = schedule.filter(item => item[`is${mealP.toLowerCase()}` as keyof Schedule]);
    meals.forEach(item => {
      if (filterMeals[item.station.stationname]) {
        filterMeals[item.station.stationname].push(item.food);
      } else {
        filterMeals[item.station.stationname] = [item.food];
      }
    });
    return filterMeals;
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
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <Text style={styles.foodText}>{item}</Text>
                </View>
              )}
            />
          </View>
        ))}
      </ScrollView>
    );
};

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          activeColor='white'
          inactiveColor='gray'
          indicatorStyle={{ backgroundColor: '#001F54', height: '100%', borderRadius: 10 }}
          style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}
        />
      )}
    />
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
  },
  foodText: {
    fontSize: 18,
    color: '#333',
  },
});


export default menu