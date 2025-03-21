import axios from 'axios';

// you have to use vm IP address.
export const sendChatbotPrompt = async (prompt: string) => {
  try {
    const response = await axios.post('http://137.99.199.114:5050/api/chat', {
      userPrompt: prompt,
    });
    return response.data; 
  } catch (error) {
    console.error("Chatbot API error:", error);
    return { success: false, message: "Failed to contact chatbot." };
  }
};