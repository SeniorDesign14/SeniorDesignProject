import { diningService } from '@/api/services/diningService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// Interface for dining hall data
interface DiningHall {
  dininghallid: number;
  hallname: string;
  location: string;
  hours: Array<{
    dininghourid: number;
    dininghallid: number;
    dayofweek: string;
    mealperiod: string;
    hours: string;
  }>;
}

// Component for a single list item
const DiningItem = ({ name, id, diningHall }: { name: string; id: string; diningHall: DiningHall }) => {

  const status = getStatus(diningHall);
  
  const handlePress = () => {
    router.push({
      pathname: "../menu",
      params: { name, id, mealPeriod: status !== "Closed" ? status[0] : "Breakfast" },
    });
  };

  return (
  <TouchableOpacity onPress={handlePress} style={styles.itemBox}>
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>{status !== "Closed" ? status[0] : "Closed"}</Text>
    </View>
    <View style={styles.statusBox}>
      <Text style={styles.subtitle}>{status === "Closed" ? "" : status[1]}</Text>
    </View>
  </TouchableOpacity>
  );
};

// Main screen component
const DiningScreen = () => {
  // State to store dining hall data
  const [diningHalls, setDiningHalls] = useState<DiningHall[]>([]);

  // Fetch dining hall data on component mount
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await diningService.getDiningHalls();
        setDiningHalls(response.diningHalls);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHalls();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HuskyHotspot</Text>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>
      <FlatList<DiningHall>
        data={diningHalls}
        keyExtractor={(item) => item.dininghallid.toString()}
        renderItem={({ item }) => <DiningItem name={item.location} id={item.dininghallid.toString()} diningHall={item}/>}
      />
    </SafeAreaView>
  );
};

// Function to parse time string to decimal
const parseTime = (timeStr: string) => {
  const [time, modifier] = timeStr.split(/(am|pm)/);
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'am' && hours === 12) {
    hours = 0;
  }
  return hours + minutes / 60;
};

// Function to get the current date
const getCurrentDate = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  return today.toLocaleDateString(undefined, options);
};

// Function for getting the status of a dining hall (hours: open/closed)
const getStatus = (hall: DiningHall) => {
  const now = new Date();
  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now.getDay()); // Current day in text
  const currentTime = now.getHours() + now.getMinutes() / 60; // Current time in decimal
  
  // Look for current day and time in the hall's hours
  for (const hour of hall.hours) {
    if (hour.dayofweek === currentDay) {
      const [start, end] = hour.hours.split('-').map(parseTime);
      if (currentTime >= start && currentTime <= end) {
        return [hour.mealperiod, hour.hours];
      }
    }
  }

  // If not found, then dining hall is closed
  return 'Closed';
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#001F54',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 4,
  },
  itemBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statusBox: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default DiningScreen;
