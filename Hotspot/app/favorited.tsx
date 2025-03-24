import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { favoritedService } from '@/api/services/favoritedService';

interface FavoritedItem {
    food: string,
}

const favorited = () => {
    // fetch user's favorited food
    const [favoritedFood, setFavorited] = useState<FavoritedItem[]>([]);

    useEffect(() => {
        const fetchFavorited = async () => {
            try {
                const userid = "1";
                const response = await favoritedService.getFavorited(userid);
                setFavorited(response.favoriteFoods);
                console.log(response.favoriteFoods);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFavorited();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Favorited Foods For User 1</Text>
            <FlatList
            data={favoritedFood}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.foodText}>{item.food}</Text>
                </View>
            )}
            />
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
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
    },
});

export default favorited