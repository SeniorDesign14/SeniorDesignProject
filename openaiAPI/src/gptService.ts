import OpenAI from "openai";
import dotenv from "dotenv";
import MenuItem from "./models/menuItem";
import { QueryTypes } from "sequelize";
import sequelize from "./db";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is loaded from the .env file
});

export async function askGPT(prompt: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: "gpt-4",
      prompt,
      max_tokens: 200,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error("GPT API Error:", error);
    return "Error processing request.";
  }
}

