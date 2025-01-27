import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { scheduleService } from '@/api/services/scheduleService';
import { format } from 'date-fns';


// Interface for dining hall data
interface Schedule {
    food: string;
  }

// Identify date
const date = new Date();
const formattedDate: string = format(date, 'yyyy-MM-dd');

const menu = () => {
    // grab name and id from dining.tsx (from DiningItem component)
    const { name, id } = useLocalSearchParams() as { name: string; id: string };
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{formattedDate}</Text>
            {schedule.map((item, index) => (
            <Text key={index} style={styles.item}>
                - {item.food}
            </Text>
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