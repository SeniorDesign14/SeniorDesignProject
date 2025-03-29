import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { format, parseISO } from 'date-fns';
import { favoritedService } from '@/api/services/favoritedService';
import { scheduleService } from '@/api/services/scheduleService';

const sum = () => {
  const [matches, setMatches] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(new Date(new Date().setDate(new Date().getDate() + 6)), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch favorited foods
        const favoritedResponse = await favoritedService.getFavorited('jas20060'); // Replace with actual netid
        const favoritedList = favoritedResponse.favoriteFoods.map((item: { foodid: number }) => item.foodid);
        // console.log('Favorited Foods:', favoritedList);

        // Fetch schedule
        const scheduleResponse = await scheduleService.getScheduleRange(today, endDate);
        const schedule = scheduleResponse.schedule;
        // console.log('Schedule:', schedule);

        const scheduleWithTime = schedule.map((item: Schedule) => {
          let time = '';
        
          // // Check if the day is Saturday or Sunday
          // const dayOfWeek = new Date(item.scheduledate).getDay(); // 5 == Saturday, 6 == Sunday
          // const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        
          // if (isWeekend) {
          //   if (item.isbreakfast || item.islunch) {
          //     time = 'Brunch'; // Combine breakfast and lunch into "Brunch" on weekends
          //   } else if (item.isdinner) {
          //     time = 'Dinner'; // Dinner remains the same
          //   }
          // } else {
            // Weekday logic
            if (item.isbreakfast) time = 'Breakfast';
            if (item.islunch) time = 'Lunch';
            if (item.isdinner) time = 'Dinner';
          // }
        
          return { ...item, time };
        });

        // Find matches
        const matchedFoods = scheduleWithTime.filter((item: Schedule) =>
          favoritedList.includes(item.foodid)
        );

        const uniqueMatches = matchedFoods.filter(
          (item: Schedule, index: number, self: Schedule[]) =>
            index ===
            self.findIndex(
              (t) =>
                t.foodid === item.foodid &&
                t.scheduledate === item.scheduledate &&
                t.hall.location === item.hall.location
            )
        );

        setMatches(uniqueMatches);
        console.log('Matched Foods:', uniqueMatches);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Summary</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.foodName}>{item.food}</Text>
              <Text style={styles.details}>
                {format(parseISO(item.scheduledate), 'EEEE, MMM dd')} - {item.time} at {item.hall.location}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No favorited foods are being served in the next 7 days.</Text>
      )}
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    color: '#555',
  },
});

export default sum;