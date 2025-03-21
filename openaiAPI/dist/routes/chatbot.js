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
const router = express_1.default.Router();
router.get('/test', (req, res) => {
    res.json({ message: "Chatbot route is connected!" });
});
router.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPrompt } = req.body;
    try {
        // 1. Ask GPT for SQL
        const sqlQuery = yield (0, gptService_1.askGPT)(userPrompt);
        console.log("Generated SQL:", sqlQuery);
        // 2. Execute SQL
        const result = yield (0, queryExecutor_1.executeSQL)(sqlQuery);
        console.log("Query Result:", result);
        // 3. Return results
        res.json({ success: true, query: sqlQuery, result });
    }
    catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
    }
}));
exports.default = router;
