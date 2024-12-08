import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button, Switch, TextInput } from 'react-native'
import React from 'react'

// const Settings = () => {
//   return (
//     <SafeAreaView>
//       <Text>Settings</Text>
//     </SafeAreaView>
//   )
// }

const Settings: React.FC = () => {
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
            <Text>Push Notifications</Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          <View style={styles.switchRow}>
            <Text>Email Notifications</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.switchRow}>
            <Text>Dark Mode</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Default Dining Hall"
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
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
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
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
  },
});

export default Settings