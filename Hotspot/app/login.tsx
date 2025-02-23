import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleSSOLogin = () => {
    // Handle SSO login logic here
    console.log('SSO Login button pressed');
    // Navigate to the main app screen after successful login
    navigation.navigate('(tabs)');
  };

  const handleGuestLogin = () => {
    // Handle guest login logic here
    console.log('Guest Login button pressed');
    // Navigate to the main app screen as a guest
    navigation.navigate('(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to the Husky Hotspot</Text>
      <TouchableOpacity style={styles.button} onPress={handleSSOLogin}>
        <Text style={styles.buttonText}>Login with SSO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
        <Text style={styles.buttonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;