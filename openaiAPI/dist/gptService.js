"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGPT = askGPT;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Initialize OpenAI
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// // Initialize PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });
// /**
//  * Fetches menu items for a specific dining hall
//  * @param diningHallName - The name of the dining hall
//  * @returns A formatted list of menu items
//  */
// async function getMenuItems(diningHallName: string): Promise<string> {
//   try {
//     const client = await pool.connect();
//     const query = `
//       SELECT item_name, category, description 
//       FROM menu 
//       WHERE dining_hall = $1
//       ORDER BY category;
//     `;
//     const result = await client.query(query, [diningHallName]);
//     client.release();
//     if (result.rows.length === 0) {
//       return `No menu data available for ${diningHallName}.`;
//     }
//     // Format menu data as a readable string
//     const menuList = result.rows.map(
//       (item) => `${item.item_name} (${item.category}): ${item.description}`
//     );
//     return `Here are the menu items for ${diningHallName}:\n` + menuList.join("\n");
//   } catch (error) {
//     console.error("Database Error:", error);
//     return "Error fetching menu data.";
//   }
// }
// /**
//  * Generates a GPT response including menu information
//  * @param diningHall - The name of the dining hall
//  * @param userQuestion - The user's question
//  * @returns AI-generated response
//  */
// export async function askGPT(diningHall: string, userQuestion: string): Promise<string> {
//   try {
//     // Fetch menu items for the specified dining hall
//     const menuData = await getMenuItems(diningHall);
//     // Construct prompt for GPT
//     const prompt = `
//       You are a chatbot that provides information about dining halls and their menus. 
//       A user has asked: "${userQuestion}"
//       Based on the menu data, respond informatively.
//       ${menuData}
//     `;
//     const response = await openai.completions.create({
//       model: "gpt-4",
//       prompt,
//       max_tokens: 200,
//     });
//     return response.choices[0].text.trim();
//   } catch (error) {
//     console.error("GPT API Error:", error);
//     return "Error processing request.";
//   }
// }
// function getSchema(): string {
//   const schemaPath = path.join(__dirname, "..", "schema.txt"); // Adjust path based on your structure
//   return fs.readFileSync(schemaPath, "utf-8"); // Read as string
// }
// // Function to ask GPT
// export async function askGPT(userPrompt: string): Promise<string> {
//   const schema = getSchema(); // Get schema dynamically
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4-turbo",
//       messages: [
//         { role: "system", content: schema }, // schema as system message
//         { role: "user", content: userPrompt }, // user prompt
//       ],
//       max_tokens: 300, // Adjust as needed
//     });
//     return response.choices[0]?.message?.content?.trim() || "No response from AI"; // Return AI's response
//   } catch (error) {
//     console.error("GPT API Error:", error);
//     return "Error generating SQL.";
//   }
// }
const schemaPath = path_1.default.join(__dirname, "../schema.txt");
const schemaDescription = fs_1.default.readFileSync(schemaPath, "utf-8");
// AI function to generate SQL
function askGPT(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const systemPrompt = `
You are an AI SQL generator. 
Your job is to ONLY generate safe SELECT SQL queries based on the user's question and the following database schema. 
Never generate INSERT, UPDATE, DELETE, DROP, or ALTER queries. Here is the schema:
${schemaDescription}
`;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                max_tokens: 300,
            });
            const aiResponse = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
            if (!aiResponse)
                throw new Error("No response from AI.");
            return aiResponse;
        }
        catch (error) {
            console.error("GPT API Error:", error);
            throw new Error("Failed to generate SQL.");
        }
    });
}
