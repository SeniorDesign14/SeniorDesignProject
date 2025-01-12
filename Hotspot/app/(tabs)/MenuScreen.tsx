import React from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// Static menu data (Replace this with dynamic data from backend)
const staticMenu = {
  Breakfast: ['Bacon', 'Cheesy Scrambled Eggs', 'French Toast'],
  'World Fare': ['Hard Boiled Eggs', 'Pancake & Waffle Syrup'],
  Desserts: ['Banana Bread'],
};

// Menu Screen Component
const MenuScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { hallName } = route.params;

  // Format static data into sections
  const sections = Object.keys(staticMenu).map((section) => ({
    title: section,
    data: staticMenu[section],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{hallName}</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ItemDetails', { itemName: item })}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>{title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#001F54',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sectionHeader: {
    backgroundColor: '#001F54',
    padding: 8,
    paddingHorizontal: 16,
  },
  sectionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: { fontSize: 16 },
});

export default MenuScreen;

