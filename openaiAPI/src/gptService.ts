import OpenAI from "openai";
import dotenv from "dotenv";
import { Pool } from "pg"; 

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// Initialize PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

/**
 * Fetches menu items for a specific dining hall
 * @param diningHallName - The name of the dining hall
 * @returns A formatted list of menu items
 */
async function getMenuItems(diningHallName: string): Promise<string> {
  try {
    const client = await pool.connect();
    const query = `
      SELECT item_name, category, description 
      FROM menu 
      WHERE dining_hall = $1
      ORDER BY category;
    `;

    const result = await client.query(query, [diningHallName]);
    client.release();

    if (result.rows.length === 0) {
      return `No menu data available for ${diningHallName}.`;
    }

    // Format menu data as a readable string
    const menuList = result.rows.map(
      (item) => `${item.item_name} (${item.category}): ${item.description}`
    );

    return `Here are the menu items for ${diningHallName}:\n` + menuList.join("\n");
  } catch (error) {
    console.error("Database Error:", error);
    return "Error fetching menu data.";
  }
}

/**
 * Generates a GPT response including menu information
 * @param diningHall - The name of the dining hall
 * @param userQuestion - The user's question
 * @returns AI-generated response
 */
export async function askGPT(diningHall: string, userQuestion: string): Promise<string> {
  try {
    // Fetch menu items for the specified dining hall
    const menuData = await getMenuItems(diningHall);

    // Construct prompt for GPT
    const prompt = `
      You are a chatbot that provides information about dining halls and their menus. 
      A user has asked: "${userQuestion}"
      
      Based on the menu data, respond informatively.
      
      ${menuData}
    `;

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

