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
    // try {
    // 1. Ask GPT for SQL
    const sqlQuery = yield (0, gptService_1.askGPT)(userPrompt);
    console.log("Original SQL:", sqlQuery);
    // 2. Replace CURDATE() and CURRENT_DATE with today's string
    // const today = new Date().toISOString().split('T')[0];  // e.g., '2025-03-24'
    // let safeSQL = sqlQuery
    //   .replace(/\bCURDATE\s*\(\s*\)/gi, `'${today}'`)
    //   .replace(/\bCURRENT_DATE\b/gi, `'${today}'`);
    // console.log("Patched SQL:", safeSQL);
    // 3. Execute safe SQL
    const result = yield (0, queryExecutor_1.executeSQL)(sqlQuery);
    // 4. Return results
    res.json({ success: true, query: sqlQuery, result });
    // } catch (error) {
    //   console.error("Chatbot Error:", error);
    //   res.status(500).json({ success: false, message: "An error occurred." });
    // }
}));
exports.default = router;
