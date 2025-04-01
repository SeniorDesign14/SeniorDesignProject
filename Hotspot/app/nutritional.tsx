import { nutritionalService } from '@/api/services/nutritionalService';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
 
const nutritional = () => {
  const { foodid } = useLocalSearchParams();
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | null>(null);
 
  useEffect(() => {
    const fetchNutritionalInfo = async () => {
      try {
        if (typeof foodid === 'string') {
          const response = await nutritionalService.getNutritional(foodid);
          setNutritionalInfo(response.nutritionalInfo);
        } else {
          console.error('Invalid foodid format');
        }
      } catch (error) {
        console.error(error);
      }
    };
 
    fetchNutritionalInfo();
  }, []);
 
  if (!nutritionalInfo) {
    return (
<View style={styles.loadingContainer}>
<Text style={styles.loadingText}>Loading...</Text>
</View>
    );
  }
 
  return (
<ScrollView contentContainerStyle={styles.container}>
<Text style={styles.header}>{nutritionalInfo.food}</Text>
<View style={styles.infoBox}>
<Text style={styles.label}>Calories: <Text style={styles.value}>{nutritionalInfo.calories}</Text></Text>
<Text style={styles.label}>Total Fat: <Text style={styles.value}>{nutritionalInfo.totalfat}g ({nutritionalInfo.totalfatdv}%)</Text></Text>
<Text style={styles.label}>Saturated Fat: <Text style={styles.value}>{nutritionalInfo.saturatedfat}g ({nutritionalInfo.saturatedfatdv}%)</Text></Text>
<Text style={styles.label}>Trans Fat: <Text style={styles.value}>{nutritionalInfo.transfat}g</Text></Text>
<Text style={styles.label}>Cholesterol: <Text style={styles.value}>{nutritionalInfo.cholesterol}mg ({nutritionalInfo.cholesteroldv}%)</Text></Text>
<Text style={styles.label}>Sodium: <Text style={styles.value}>{nutritionalInfo.sodium}mg ({nutritionalInfo.sodiumdv}%)</Text></Text>
<Text style={styles.label}>Carbs: <Text style={styles.value}>{nutritionalInfo.carbs}g ({nutritionalInfo.carbsdv}%)</Text></Text>
<Text style={styles.label}>Fiber: <Text style={styles.value}>{nutritionalInfo.fiber}g ({nutritionalInfo.fiberdv}%)</Text></Text>
<Text style={styles.label}>Sugars: <Text style={styles.value}>{nutritionalInfo.sugars}g</Text></Text>
<Text style={styles.label}>Added Sugars: <Text style={styles.value}>{nutritionalInfo.addedsugars}g ({nutritionalInfo.addedsugarsdv}%)</Text></Text>
<Text style={styles.label}>Protein: <Text style={styles.value}>{nutritionalInfo.protein}g</Text></Text>
<Text style={styles.label}>Calcium: <Text style={styles.value}>{nutritionalInfo.calcium}mg ({nutritionalInfo.calciumdv}%)</Text></Text>
<Text style={styles.label}>Iron: <Text style={styles.value}>{nutritionalInfo.iron}mg ({nutritionalInfo.irondv}%)</Text></Text>
<Text style={styles.label}>Vitamin D: <Text style={styles.value}>{nutritionalInfo.vitamind}mcg ({nutritionalInfo.vitaminddv}%)</Text></Text>
<Text style={styles.label}>Potassium: <Text style={styles.value}>{nutritionalInfo.potassium}mg ({nutritionalInfo.potassiumdv}%)</Text></Text>
</View>
</ScrollView>
  );
};
 
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  value: {
    fontWeight: '400',
    color: '#000',
  },
});
 
export default nutritional;