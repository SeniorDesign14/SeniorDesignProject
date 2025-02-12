import React, { useState } from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ScrollView,} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// const Summary = () => {
//   return (
//     <SafeAreaView>
//       <Text>Summary</Text>
//     </SafeAreaView>
//   )
// }

const Summary: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularMeals, setPopularMeals] = useState([
    { id: '1', name: 'Pizza', votes: 120 },
    { id: '2', name: 'Burger', votes: 110 },
    { id: '3', name: 'Pasta', votes: 95 },
  ]);

  const weeks = ['This Week', 'Last Week', 'Two Weeks Ago'];

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
    setShowDropdown(false);

    if (week === 'This Week') {
      setPopularMeals([
        { id: '1', name: 'Pizza', votes: 120 },
        { id: '2', name: 'Burger', votes: 110 },
        { id: '3', name: 'Pasta', votes: 95 },
      ]);
    } else if (week === 'Last Week') {
      setPopularMeals([
        { id: '4', name: 'Salad', votes: 130 },
        { id: '5', name: 'Tacos', votes: 100 },
        { id: '6', name: 'Sushi', votes: 90 },
      ]);
    } else {
      setPopularMeals([
        { id: '7', name: 'Fried Rice', votes: 125 },
        { id: '8', name: 'Chicken Wings', votes: 115 },
        { id: '9', name: 'Pancakes', votes: 85 },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Summary</Text>

      {/* Dropdown Selector */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownButtonText}>{selectedWeek}</Text>
          <MaterialIcons
            name={showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="#333"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownList}>
            {weeks
              .filter((week) => week !== selectedWeek) 
              .map((week) => (
                <TouchableOpacity
                  key={week}
                  style={styles.dropdownItem}
                  onPress={() => handleWeekChange(week)}
                >
                  <Text style={styles.dropdownItemText}>{week}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>

      {/* Popular Meals Section */}
      <View style={styles.mealsContainer}>
        <Text style={styles.sectionTitle}>
          Most Popular Meals for {selectedWeek}
        </Text>
        <FlatList
          data={popularMeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealVotes}>{item.votes} votes</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  mealsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  mealName: {
    fontSize: 16,
  },
  mealVotes: {
    fontSize: 16,
    color: '#555',
  },
});


export default Summary