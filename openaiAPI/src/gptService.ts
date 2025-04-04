import OpenAI from "openai";
import dotenv from "dotenv";
import { Pool } from "pg"; 
import fs from 'fs';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read schema.txt once when this file is loaded
const schemaPath = path.join(__dirname, "..", "schema.txt");
let schemaText = "";

try {
  schemaText = fs.readFileSync(schemaPath, "utf-8");
} catch (err) {
  console.error("Failed to read schema.txt:", err);
}

export async function askGPT(userPrompt: string): Promise<string> {
  const prompt = `
You are an intelligent SQL generator. Based on the schema provided, convert the user's question into a correct and secure SQL query for PostgreSQL.

Schema:
${schemaText}

Rules:
- Always use lowercase table and column names.
- For dining hall filtering, use the 'location' column from the 'dininghalls' table (NOT hallname).
- For food items, use the 'food' column from the 'menu' table.
- Ensure the SQL is valid and uses proper JOINs based on foreign keys.

User question: ${userPrompt}

SQL:
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const sql = response.choices[0].message.content?.trim();
  return sql || "";
}