import { askGPT } from "./src/gptService"; 

async function test() {
  try {
    const response = await askGPT("North Campus Dining Hall", "What are today's lunch options?");
    console.log("GPT Response:", response);
  } catch (error) {
    console.error("Error testing GPT API:", error);
  }
}

test();
