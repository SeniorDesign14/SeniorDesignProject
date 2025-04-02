import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ScrollView } from 'react-native';
import { format, parseISO, set } from 'date-fns';
import { favoritedService } from '@/api/services/favoritedService';
import { scheduleService } from '@/api/services/scheduleService';

const sum = () => {
  const [matches, setMatches] = useState<Schedule[]>([]);
  const [top5, setTop5] = useState<{ food: string, count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(new Date(new Date().setDate(new Date().getDate() + 6)), 'yyyy-MM-dd');

  // THIS IS ALL POST PROCESSING DATA (MAY END UP DOING THIS ON THE BACKEND)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch top5 favorited foods
        const top5Response = await favoritedService.getTop5Favorited();
        const top5Map = top5Response["favoriteFoods"];
        // USING THIS FOR DISPLAYING DATA OF TOP 5 FAVORITED FOODS
        setTop5(top5Map);
        // console.log('Top 5 Foods:', top5Map);

        // Fetch favorited foods
        const favoritedResponse = await favoritedService.getFavorited('jas20060'); // Replace with actual netid
        const favoritedList = favoritedResponse.favoriteFoods.map((item: { foodid: number }) => item.foodid);

        // Fetch schedule
        const scheduleResponse = await scheduleService.getScheduleRange(today, endDate);
        const schedule = scheduleResponse.schedule;

        // Map schedule to include time (breakfast, lunch, dinner)
        const scheduleWithTime = schedule.map((item: Schedule) => {
          let time = '';
  
          if (item.isbreakfast) time = 'Breakfast';
          if (item.islunch) time = 'Lunch';
          if (item.isdinner) time = 'Dinner';
        
          return { ...item, time };
        });

        // Find matches of schedule to favorited foods
        const matchedFoods = scheduleWithTime.filter((item: Schedule) =>
          favoritedList.includes(item.foodid)
        );

        // Group foods by time (breakfast, lunch, dinner) from matchedFoods for those served at the same location on the same day (EX: if served on lunch and dinner then group to one entry of "Lunch / Dinner")
        const groupedMatches = matchedFoods.reduce((acc: Schedule[], item: Schedule) => {
          // Check if an entry for the same food, date, and location already exists
          const existingIndex = acc.findIndex(
            (t) =>
              t.foodid === item.foodid &&
              t.scheduledate === item.scheduledate &&
              t.hall.location === item.hall.location
          );
        
          if (existingIndex !== -1) {
            // If it exists, append the time to the existing entry
            const existingItem = acc[existingIndex];
            if (!existingItem.time.includes(item.time)) {
              existingItem.time = `${existingItem.time} / ${item.time}`;
            }
          } else {
            // If it doesn't exist, add the item to the accumulator
            acc.push({ ...item });
          }
        
          return acc;
        }, []);

        setMatches(groupedMatches);
        // console.log('Grouped Foods:', groupedMatches);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupMatchesByDay = (matches: Schedule[]) => {
    // Generate all days starting from today for the next 6 days
    const daysInRange = [];
    let currentDate = new Date(new Date());
  
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(currentDate, 'EEEE, MMMM dd'); // Format as "Day, Month Date"
      daysInRange.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  
    // Prepopulate the grouped object with all days
    const grouped = daysInRange.reduce((acc: { [key: string]: Schedule[] }, day) => {
      acc[day] = []; // Initialize each day with an empty array
      return acc;
    }, {});
  
    // Group matches by day
    matches.forEach((item: Schedule) => {
      const day = format(parseISO(item.scheduledate), 'EEEE, MMMM dd'); // Get day of the week
      if (grouped[day]) {
        grouped[day].push(item);
      }
    });
  
    // Sort each day's matches by time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        const timeOrder = ['Breakfast', 'Lunch', 'Dinner'];
        const getTimePriority = (time: string) => {
          const times = time.split(' / ');
          return Math.min(...times.map((t) => timeOrder.indexOf(t)));
        };
        return getTimePriority(a.time) - getTimePriority(b.time);
      });
    });
  
    return grouped;
  };

  // USING THIS FOR DISPLAYING DATA OF WEEKLY SUMMARY
  const groupedMatches = groupMatchesByDay(matches);
  // console.log('Grouped Matches:', groupedMatches);

  // END OF POST PROCESSING DATA

  // USE top5 AND groupedMatches TO DISPLAY DATA
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading ? (
        // Show a loading indicator or message while loading
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        // Render the content only after loading is complete
        <>
          <Text style={styles.header}>Summary</Text>

          {/* Top 5 Favorited Foods */}
          <Text style={styles.subHeader}>Top Favorited</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Food</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Count</Text>
            </View>
            {top5.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index === 0 ? '🔥 ' : ''}{item.food}</Text>
                <Text style={styles.tableCell}>{item.count}</Text>
              </View>
            ))}
          </View>

          {/* Weekly Matches */}
          <Text style={styles.subHeader}>Your Weekly Summary</Text>
          {Object.keys(groupedMatches).length > 0 ? (
            Object.entries(groupedMatches).map(([day, items]) => (
              <View key={day} style={styles.daySection}>
                <Text style={styles.dayHeader}>{day}</Text>
                <View style={styles.table}>
                  {items.length > 0 ? (
                    <>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Food</Text>
                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Time</Text>
                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Location</Text>
                      </View>
                      {items.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCell}>{item.food}</Text>
                          <Text style={styles.tableCell}>{item.time}</Text>
                          <Text style={styles.tableCell}>{item.hall.location}</Text>
                        </View>
                      ))}
                    </>
                  ) : (
                    // Message for days with no items
                    <Text style={styles.noItemsText}>No favorites served on this day.</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text>No favorited foods are being served in the next 7 days.</Text>
          )}
        </>
      )}
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
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
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  top5Item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noItemsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default sum;