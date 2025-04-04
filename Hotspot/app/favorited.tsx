import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { favoritedService } from '../api/services/favoritedService';
import { authuserService } from '../api/services/authuserService';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';


interface FavoritedItem {
  food: string;
}

const Favorited = () => {
  const [favoritedFood, setFavorited] = useState<FavoritedItem[]>([]);
  const [userNetid, setUserNetid] = useState<string | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Favorited Foods',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.push('/dining')} style={{ paddingLeft: 16 }}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#001F54',
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);

  useEffect(() => {
    const fetchFavorited = async () => {
      try {
        const user = await authuserService.getCurrentUser();
        setUserNetid(user.netid);

        const response = await favoritedService.getFavorited(user.netid);
        setFavorited(response.favoriteFoods);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorited();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dining')} style={styles.backIcon}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>⭐ Your Favorited Foods ⭐</Text>
        <Text style={styles.subText}>
            NetID: <Text style={{ fontWeight: '600' }}>{userNetid ?? 'Loading...'}</Text>
        </Text>
      </View>

      <FlatList
        data={favoritedFood}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't favorited any foods yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.foodText}>{item.food}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F54', // dark blue background to match header
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // or use marginRight for spacing
  },  
  header: {
    backgroundColor: '#001F54',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,        // adds blue gap on left/right
    paddingTop: 16,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});

export default Favorited;
