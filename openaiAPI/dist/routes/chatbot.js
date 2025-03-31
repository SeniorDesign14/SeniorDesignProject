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
const express_1 = __importDefault(require("express"));
const gptService_1 = require("../gptService");
const queryExecutor_1 = require("../utils/queryExecutor");
const validators_1 = require("../utils/validators");
// const router = express.Router();
// router.get("/test", (_req: Request, res: Response) => {
//   res.json({ message: "Chatbot route is connected!" });
// });
// router.post("/chat", async (req: Request, res: Response) => {
//   const { userPrompt } = req.body;
//   try {
//     const sqlQuery = await askGPT(userPrompt);
//     console.log("Generated SQL:", sqlQuery);
//     const result = await executeSQL(sqlQuery);
//     console.log("Query Result:", result);
//     res.json({ success: true, query: sqlQuery, result });
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     res.status(500).json({ success: false, message: "An error occurred." });
//   }
// });
// export default router;
const router = express_1.default.Router();
router.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPrompt } = req.body;
    try {
        if (!userPrompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt required.",
            });
        }
        // Ask GPT to generate SQL and extract intent
        const sqlQuery = yield (0, gptService_1.askGPT)(userPrompt);
        console.log("Generated SQL:", sqlQuery);
        // ✅ Optional: extract known values from prompt (basic example)
        const lowerPrompt = userPrompt.toLowerCase();
        // Check if prompt includes a dining hall name
        const knownDiningHalls = ["mcmahon", "connecticut", "north", "south", "northwest", "putnam", "whitney", "gelfenbein"];
        const mentionedHall = knownDiningHalls.find((hall) => lowerPrompt.includes(hall));
        if (mentionedHall && !(yield (0, validators_1.isValidDiningHall)(mentionedHall))) {
            return res.status(400).json({
                success: false,
                message: `Invalid dining hall: ${mentionedHall}`,
            });
        }
        // You can do similar validation for food items if needed
        const foodKeywords = ["pizza", "chicken", "steak", "salad"];
        const mentionedFood = foodKeywords.find((item) => lowerPrompt.includes(item));
        if (mentionedFood && !(yield (0, validators_1.isValidFoodItem)(mentionedFood))) {
            return res.status(400).json({
                success: false,
                message: `Food item not found: ${mentionedFood}`,
            });
        }
        // Check for date format if user includes one
        const dateRegex = /\d{4}-\d{2}-\d{2}/;
        const dateMatch = userPrompt.match(dateRegex);
        if (dateMatch && !(0, validators_1.isValidDate)(dateMatch[0])) {
            return res.status(400).json({
                success: false,
                message: `Invalid date format. Use YYYY-MM-DD.`,
            });
        }
        // Execute SQL from GPT
        const result = yield (0, queryExecutor_1.executeSQL)(sqlQuery);
        console.log("Query Result:", result);
        res.json({ success: true, query: sqlQuery, result });
    }
    catch (err) {
        console.error("Chatbot Error:", err);
        res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
}));
exports.default = router;
