import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import {
  getAllDiningHalls,
  getAllFoodItems
} from './utils/validators.js'; // adjust path to match your layout

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schemaPath = path.join(path.resolve(), "schema.txt");
const schemaDescription = fs.readFileSync(schemaPath, "utf-8");

// AI function to generate SQL
export async function askGPT(prompt) {
  const allHalls = await getAllDiningHalls();
  const allFoods = await getAllFoodItems();

  const systemPrompt = `
You are an AI SQL generator working with a PostgreSQL database. 
Your job is to ONLY generate safe SELECT SQL queries based on the user's question and the following database schema. 
Never generate INSERT, UPDATE, DELETE, DROP, or ALTER queries. 
Use PostgreSQL syntax (e.g. CURRENT_DATE instead of CURDATE).
NEVER use MySQL functions like CURDATE(), NOW(), etc.
Note: schedule.scheduleDate is stored as a **string (YYYY-MM-DD)**, not a date type.
Use TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') for comparisons.

Valid dining halls:
${allHalls.join(", ")}

Valid dining halls:
${allFoods.slice(0,100).join(", ")}

Here is the schema:
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
