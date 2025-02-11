// import { View, Text, SafeAreaView } from 'react-native'
// import React from 'react'

// const Dining = () => {
//   return (
//     // Safe Area View to ensure content is within boundaries of device
//     // (i.e. not behind the notch or status bar)
//     <SafeAreaView>
//       <Text>Dining</Text>
//     </SafeAreaView>
//   )
// }

// export default Dining

import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

// List of dining halls with identifiers
const diningHalls = [
  { name: 'Connecticut', id: 'connecticut' },
  { name: 'McMahon', id: 'mcmahon' },
  { name: 'North', id: 'north' },
  { name: 'Northwest', id: 'northwest' },
  { name: 'Putnam', id: 'putnam' },
  { name: 'South', id: 'south' },
  { name: 'Towers', id: 'towers' }, // Towers = Gelfenbien
  { name: 'Buckley', id: 'buckley' },
  { name: 'Whitney', id: 'whitney' },
];

// Meal schedules based on time
const schedules = {
  weekday: {
    connecticut: [
      { name: 'Breakfast', start: 7, end: 10.75 },
      { name: 'Lunch', start: 11, end: 14.5 },
      { name: 'Dinner', start: 16, end: 19.25 },
    ],
    mcmahon: [
      { name: 'Breakfast', start: 7, end: 10.75 },
      { name: 'Lunch', start: 11, end: 14 },
      { name: 'Dinner', start: 15.5, end: 19.25 },
    ],
    north: [
      { name: 'Breakfast', start: 7, end: 10.75 },
      { name: 'Lunch', start: 11, end: 15 },
      { name: 'Dinner', start: 16.5, end: 19.25 },
    ],
    south: [
      { name: 'Breakfast', start: 7, end: 10.75 },
      { name: 'Lunch', start: 11, end: 14.25 },
      { name: 'Dinner', start: 15.75, end: 22 },
    ],
  },
  weekend: {
    connecticut: [
      { name: 'Brunch', start: 10.5, end: 14.5 },
      { name: 'Dinner', start: 16, end: 19.25 },
    ],
    mcmahon: [
      { name: 'Brunch', start: 10.5, end: 14 },
      { name: 'Dinner', start: 15.5, end: 19.25 },
    ],
    south: [
      { name: 'Breakfast', start: 7, end: 9.5 },
      { name: 'Brunch', start: 9.5, end: 14.25 },
      { name: 'Dinner', start: 15.75, end: 22 },
    ],
  },
};

// Function to determine the current meal
const getCurrentMeal = (hallId: string) => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60; // Current time in decimal
  const day = now.getDay(); // Sunday = 0, Monday = 1, ...

  const schedule = day >= 1 && day <= 5 ? schedules.weekday[hallId] : schedules.weekend[hallId];

  if (!schedule) return 'Closed'; // Default if no schedule exists

  for (let meal of schedule) {
    if (hour >= meal.start && hour < meal.end) {
      return meal.name;
    }
  }

  return 'Closed'; // If no meal matches the current time
};

// Component for a single list item
const DiningItem = ({ name, id }: { name: string; id: string }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{name}</Text>
    <Text style={styles.subtitle}>{getCurrentMeal(id)}</Text>
  </View>
);

// Main screen component
const DiningScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HuskyHotspot</Text>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>
      <FlatList
        data={diningHalls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DiningItem name={item.name} id={item.id} />}
      />
    </SafeAreaView>
  );
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
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
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
});

export default DiningScreen;
