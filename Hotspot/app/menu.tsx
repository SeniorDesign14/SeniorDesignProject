import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { scheduleService } from '@/api/services/scheduleService';
import { format } from 'date-fns';


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

// Identify date
const date = new Date();
const formattedDate: string = format(date, 'yyyy-MM-dd');

const menu = () => {
  // grab name and id from dining.tsx (from DiningItem component)
  const { name, id, mealPeriod } = useLocalSearchParams() as { name: string; id: string, mealPeriod: string };
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (name) {
      navigation.setOptions({ title: name }); // Set the screen title to the "name"
    }
  }, [name, navigation]);

  const [schedule, setSchedule] = useState<Schedule[]>([]);
  
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
  }, []);

  // Get meals based on current mealPeriod (breakfast, lunch, dinner) and sort into dictionary by dining station name
  const getMeals = () => {
    let filterMeals: { [key: string]: Schedule['food'][] } = {};
    const meals = schedule.filter(item => item[`is${mealPeriod.toLowerCase()}` as keyof Schedule]);
    meals.forEach(item => {
      if (filterMeals[item.station.stationname]) {
        filterMeals[item.station.stationname].push(item.food);
      } else {
        filterMeals[item.station.stationname] = [item.food];
      }
    });
    return filterMeals;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{formattedDate}</Text>
      {Object.entries(getMeals()).map(([station, foods], index) => (
        <View key={index}>
          <Text style={styles.item}>{station}</Text>
          {foods.map((food, foodIndex) => (
            <Text key={foodIndex} style={styles.item}>
              - {food}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default menu