import axios from 'axios';

// Replace with your actual VM IP address
const BASE_URL = 'http://137.99.199.114:8080';

export const sendChatbotPrompt = async (prompt: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat`, {
      userPrompt: prompt,
    });
    return response.data;
  } catch (error) {
    console.error("Chatbot API error:", error);
    return { success: false, message: "Failed to contact chatbot." };
  }
};