import OpenAI from "openai";
import dotenv from "dotenv";
import { Pool } from "pg"; 
import fs from 'fs';
import path from 'path';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const schemaPath = path.join(__dirname, "../schema.txt");
const schemaDescription = fs.readFileSync(schemaPath, "utf-8");

// AI function to generate SQL
export async function askGPT(prompt: string): Promise<string> {
  const systemPrompt = `
You are an AI SQL generator. 
Your job is to ONLY generate safe SELECT SQL queries based on the user's question and the following database schema. 
Never generate INSERT, UPDATE, DELETE, DROP, or ALTER queries. Here is the schema:
${schemaDescription}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim();

    if (!aiResponse) throw new Error("No response from AI.");

    return aiResponse;
  } catch (error) {
    console.error("GPT API Error:", error);
    throw new Error("Failed to generate SQL.");
  }
}