import { nutritionalService } from '@/api/services/nutritionalService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

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
  const { foodid } = useLocalSearchParams();
  const router = useRouter();
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
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>{nutritionalInfo.food}</Text>

      {/* Sub-header info */}
      <View style={styles.subHeader}>
        <Text style={styles.subText}>Serving Size: {nutritionalInfo.servingsize}</Text>
        <Text style={styles.subText}>Servings per Container: {nutritionalInfo.servingspercontainer}</Text>
      </View>

      {/* Nutrition Info */}
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

      {/* Allergens Section (Placeholder) */}
      <View style={styles.allergensBox}>
        <Text style={styles.label}>Allergens: <Text style={styles.value}>Contains milk, soy</Text></Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001F54',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#001F54',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#fff',
  },
  subHeader: {
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: '#cdd4e0',
    marginBottom: 4,
  },
  infoBox: {
    backgroundColor: '#ffffff',
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
  allergensBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fef6f6',
    borderRadius: 10,
    borderColor: '#f2c6c6',
    borderWidth: 1,
  },
});

export default nutritional;
