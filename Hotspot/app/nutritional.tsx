import { nutritionalService } from '@/api/services/nutritionalService';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface NutritionalInfo {
  foodid: number;
  food: string;
  servingspercontainer: number;
  servingsize: string;
  calories: number;
  totalfat: number;
  totalfatdv: number;
  saturatedfat: number;
  saturatedfatdv: number;
  transfat: number;
  cholesterol: number;
  cholesteroldv: number;
  sodium: number;
  sodiumdv: number;
  carbs: number;
  carbsdv: number;
  fiber: number;
  fiberdv: number;
  sugars: number;
  addedsugars: number;
  addedsugarsdv: number;
  protein: number;
  calcium: number;
  calciumdv: number;
  iron: number;
  irondv: number;
  vitamind: number;
  vitaminddv: number;
  potassium: number;
  potassiumdv: number;
}

const nutritional = () => {
  // fetch nutritional info
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | null>(null);

  useEffect(() => {
    const fetchNutritionalInfo = async () => {
      try {
        const foodid = '2902';
        const response = await nutritionalService.getNutritional(foodid);
        setNutritionalInfo(response.nutritionalInfo);
        console.log(response.nutritionalInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNutritionalInfo();
  }, []);

  if (!nutritionalInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View>
            <Text style={styles.header}>{nutritionalInfo.food}</Text>
            {/* <Text style={styles.item}>Servings per container: {nutritionalInfo.servingspercontainer}</Text>
            <Text style={styles.item}>Serving size: {nutritionalInfo.servingsize}</Text> */}
            <Text style={styles.item}>Calories: {nutritionalInfo.calories}</Text>
            <Text style={styles.item}>Total fat: {nutritionalInfo.totalfat}g ({nutritionalInfo.totalfatdv}%)</Text>
            <Text style={styles.item}>Saturated fat: {nutritionalInfo.saturatedfat}g ({nutritionalInfo.saturatedfatdv}%)</Text>
            <Text style={styles.item}>Trans fat: {nutritionalInfo.transfat}g</Text>
            <Text style={styles.item}>Cholesterol: {nutritionalInfo.cholesterol}mg ({nutritionalInfo.cholesteroldv}%)</Text>
            <Text style={styles.item}>Sodium: {nutritionalInfo.sodium}mg ({nutritionalInfo.sodiumdv}%)</Text>
            <Text style={styles.item}>Carbohydrates: {nutritionalInfo.carbs}g ({nutritionalInfo.carbsdv}%)</Text>
            <Text style={styles.item}>Fiber: {nutritionalInfo.fiber}g ({nutritionalInfo.fiberdv}%)</Text>
            <Text style={styles.item}>Sugars: {nutritionalInfo.sugars}g</Text>
            <Text style={styles.item}>Added sugars: {nutritionalInfo.addedsugars}g ({nutritionalInfo.addedsugarsdv}%)</Text>
            <Text style={styles.item}>Protein: {nutritionalInfo.protein}g</Text>
            <Text style={styles.item}>Calcium: {nutritionalInfo.calcium}mg ({nutritionalInfo.calciumdv}%)</Text>
            <Text style={styles.item}>Iron: {nutritionalInfo.iron}mg ({nutritionalInfo.irondv}%)</Text>
            <Text style={styles.item}>Vitamin D: {nutritionalInfo.vitamind}mcg ({nutritionalInfo.vitaminddv}%)</Text>
            <Text style={styles.item}>Potassium: {nutritionalInfo.potassium}mg ({nutritionalInfo.potassiumdv}%)</Text>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default nutritional