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
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Read schema.txt once when this file is loaded
const schemaPath = path_1.default.join(__dirname, "..", "schema.txt");
let schemaText = "";
try {
    schemaText = fs_1.default.readFileSync(schemaPath, "utf-8");
}
catch (err) {
    console.error("Failed to read schema.txt:", err);
}
function askGPT(userPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
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
        const response = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });
        const sql = (_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim();
        return sql || "";
    });
}
