import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,} from 'react-native';
import { sendChatbotPrompt } from '@/api/services/chatbotService';

// Defining message type
type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await sendChatbotPrompt(input);

      const resultText = response.result
        ? JSON.stringify(response.result, null, 2)
        : response.message || "No result found.";

      const botResponse: Message = { text: resultText, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const botResponse: Message = {
        text: 'Sorry, failed to contact chatbot.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }

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
              <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>
                {item.text}
              </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: { padding: 10, margin: 10, borderRadius: 8, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  messageText: { fontSize: 16 },
  userMessageText: { color: '#fff' },
  botMessageText: { color: '#333' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  sendButton: { marginLeft: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatScreen;