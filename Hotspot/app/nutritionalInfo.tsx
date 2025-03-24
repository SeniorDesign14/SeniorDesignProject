import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { nutritionalService } from '../api/services/nutritionalService';


interface NutritionalInfo {
  foodID: number;
  food: string;
  servingsPerContainer: number;
  servingSize: string;
  calories: number;
  totalFat: number;
  totalFatDV: number;
  saturatedFat: number;
  saturatedFatDV: number;
  transFat: number;
  cholesterol: number;
  cholesterolDV: number;
  sodium: number;
  sodiumDV: number;
  carbs: number;
  carbsDV: number;
  fiber: number;
  fiberDV: number;
  sugars: number;
  addedSugars: number;
  addedSugarsDV: number;
  protein: number;
  calcium: number;
  calciumDV: number;
  iron: number;
  ironDV: number;
  vitaminD: number;
  vitaminDDV: number;
  potassium: number;
  potassiumDV: number;
}

const NutritionalInfoScreen = () => {
  const { foodID } = useLocalSearchParams();
  const parsedFoodID = parseInt(Array.isArray(foodID) ? foodID[0] : foodID || "");
  const [nutritionalData, setNutritionalData] = useState<NutritionalInfo | null>(null);

  useEffect(() => {
    const fetchNutritionalInfo = async () => {
        try {
            const response = await nutritionalService.getNutritionalInfo(parsedFoodID);
            setNutritionalData(response);
        } catch (error) {
            console.error(error);
        }
    };
    fetchNutritionalInfo();
}, [parsedFoodID]);

  if (!nutritionalData) {
    return <Text style={styles.loadingText}>Loading nutritional info...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{nutritionalData.food}</Text>
      <Text style={styles.subHeader}>Serving Size: {nutritionalData.servingSize}</Text>
      
      <View style={styles.nutritionalTable}>
        <Text style={styles.nutrient}>Calories: {nutritionalData.calories}</Text>
        <Text style={styles.nutrient}>Total Fat: {nutritionalData.totalFat}g ({nutritionalData.totalFatDV}%)</Text>
        <Text style={styles.nutrient}>Saturated Fat: {nutritionalData.saturatedFat}g ({nutritionalData.saturatedFatDV}%)</Text>
        <Text style={styles.nutrient}>Trans Fat: {nutritionalData.transFat}g</Text>
        <Text style={styles.nutrient}>Cholesterol: {nutritionalData.cholesterol}mg ({nutritionalData.cholesterolDV}%)</Text>
        <Text style={styles.nutrient}>Sodium: {nutritionalData.sodium}mg ({nutritionalData.sodiumDV}%)</Text>
        <Text style={styles.nutrient}>Carbs: {nutritionalData.carbs}g ({nutritionalData.carbsDV}%)</Text>
        <Text style={styles.nutrient}>Fiber: {nutritionalData.fiber}g ({nutritionalData.fiberDV}%)</Text>
        <Text style={styles.nutrient}>Sugars: {nutritionalData.sugars}g</Text>
        <Text style={styles.nutrient}>Added Sugars: {nutritionalData.addedSugars}g ({nutritionalData.addedSugarsDV}%)</Text>
        <Text style={styles.nutrient}>Protein: {nutritionalData.protein}g</Text>
        <Text style={styles.nutrient}>Calcium: {nutritionalData.calcium}mg ({nutritionalData.calciumDV}%)</Text>
        <Text style={styles.nutrient}>Iron: {nutritionalData.iron}mg ({nutritionalData.ironDV}%)</Text>
        <Text style={styles.nutrient}>Vitamin D: {nutritionalData.vitaminD}mcg ({nutritionalData.vitaminDDV}%)</Text>
        <Text style={styles.nutrient}>Potassium: {nutritionalData.potassium}mg ({nutritionalData.potassiumDV}%)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001F54',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  nutritionalTable: {
    marginTop: 10,
  },
  nutrient: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default NutritionalInfoScreen;
