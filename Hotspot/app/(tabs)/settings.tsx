import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button, Switch, TextInput } from 'react-native';
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const styles = getStyles(isDarkModeEnabled); 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionText}>Edit your profile information</Text>
          <Button title="Edit Profile" onPress={() => {}} />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.switchRow}>
            <Text style={styles.text}>Push Notifications</Text>
            <Switch value={isPushEnabled} onValueChange={setIsPushEnabled} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.text}>Email Notifications</Text>
            <Switch value={isEmailEnabled} onValueChange={setIsEmailEnabled} />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.switchRow}>
            <Text style={styles.text}>Dark Mode</Text>
            <Switch value={isDarkModeEnabled} onValueChange={setIsDarkModeEnabled} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Default Dining Hall"
            placeholderTextColor={isDarkModeEnabled ? '#aaa' : '#888'}
          />
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <Button title="FAQs" onPress={() => {}} />
          <Button title="Send Feedback" onPress={() => {}} />
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <Button title="Logout" onPress={() => {}} color="red" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Define getStyles function correctly
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
      padding: 10,
    },
    section: {
      marginVertical: 15,
      padding: 15,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: isDarkMode ? '#fff' : '#000',
    },
    sectionText: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#555',
      marginBottom: 10,
    },
    text: {
      fontSize: 14,
      color: isDarkMode ? '#fff' : '#000',
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginTop: 10,
      backgroundColor: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    },
  });

export default Settings;
