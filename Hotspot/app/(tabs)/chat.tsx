//Replace static data with API calls to fetch data from backend


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Dining hall data for responses
const diningData = {
  hours: {
    connecticut: {
      weekday: {
        breakfast: '7:00 AM - 10:45 AM',
        lunch: '11:00 AM - 2:30 PM',
        dinner: '4:00 PM - 7:15 PM',
      },
      weekend: {
        brunch: '10:30 AM - 2:30 PM',
        dinner: '4:00 PM - 7:15 PM',
      },
    },
    mcmahon: {
      weekday: {
        breakfast: '7:00 AM - 10:45 AM',
        lunch: '11:00 AM - 2:00 PM',
        dinner: '3:30 PM - 7:15 PM',
      },
      weekend: {
        brunch: '10:30 AM - 2:00 PM',
        dinner: '3:30 PM - 7:15 PM',
      },
    },
  },
  menus: {
    connecticut: {
      breakfast: ['Bacon', 'Eggs', 'French Toast'],
      lunch: ['Chicken Sandwich', 'Salad', 'Pasta'],
      dinner: ['Pizza', 'Steak', 'Vegetables'],
    },
    mcmahon: {
      breakfast: ['Omelette', 'Pancakes', 'Fruit'],
      lunch: ['Burger', 'Soup', 'Wraps'],
      dinner: ['Chicken', 'Rice', 'Fish'],
    },
  },
};

// Predefined responses for common questions
const processUserInput = (input: string) => {
  const lowerInput = input.toLowerCase();

  // Check for dining hall hours
  if (lowerInput.includes('hours') || lowerInput.includes('time')) {
    if (lowerInput.includes('connecticut')) {
      return 'Connecticut Dining Hall Hours:\n- Breakfast: 7:00 AM - 10:45 AM\n- Lunch: 11:00 AM - 2:30 PM\n- Dinner: 4:00 PM - 7:15 PM';
    } else if (lowerInput.includes('mcmahon')) {
      return 'McMahon Dining Hall Hours:\n- Breakfast: 7:00 AM - 10:45 AM\n- Lunch: 11:00 AM - 2:00 PM\n- Dinner: 3:30 PM - 7:15 PM';
    }
  }

  // Check for menu items
  if (lowerInput.includes('menu')) {
    if (lowerInput.includes('connecticut') && lowerInput.includes('breakfast')) {
      return `Connecticut Breakfast Menu: ${diningData.menus.connecticut.breakfast.join(', ')}`;
    } else if (lowerInput.includes('mcmahon') && lowerInput.includes('lunch')) {
      return `McMahon Lunch Menu: ${diningData.menus.mcmahon.lunch.join(', ')}`;
    }
  }

  return "Sorry, I couldn't find that information. Please ask about specific dining hall hours or menus!";
};

// Main Chat Screen Component
const ChatScreen = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  // Handle sending a message
  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    const botResponse = { text: processUserInput(input), sender: 'bot' };

    setMessages((prevMessages) => [...prevMessages, userMessage, botResponse]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;