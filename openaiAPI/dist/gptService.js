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
const schemaPath = path_1.default.join(__dirname, "../schema.txt");
const schemaDescription = fs_1.default.readFileSync(schemaPath, "utf-8");
// AI function to generate SQL
function askGPT(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const systemPrompt = `
You are an AI SQL generator working with a PostgreSQL database. 
Your job is to ONLY generate safe SELECT SQL queries based on the user's question and the following database schema. 
Never generate INSERT, UPDATE, DELETE, DROP, or ALTER queries. 
Use PostgreSQL syntax (e.g. CURRENT_DATE instead of CURDATE).
NEVER use MySQL functions like CURDATE(), NOW(), etc.
Note: schedule.scheduleDate is stored as a **string (YYYY-MM-DD)**, not a date type.
Use TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') for comparisons.
Here is the schema:
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
