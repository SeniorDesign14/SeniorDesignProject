import express from "express";
import { askGPT } from "../gptService";
import { executeSQL } from "../utils/queryExecutor";

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: "Chatbot route is connected!" });
});

router.post('/chat', async (req, res) => {
  const { userPrompt } = req.body;

  // try {
    // 1. Ask GPT for SQL
    const sqlQuery = await askGPT(userPrompt);
    console.log("Original SQL:", sqlQuery);

    // 2. Replace CURDATE() and CURRENT_DATE with today's string
    // const today = new Date().toISOString().split('T')[0];  // e.g., '2025-03-24'

    // let safeSQL = sqlQuery
    //   .replace(/\bCURDATE\s*\(\s*\)/gi, `'${today}'`)
    //   .replace(/\bCURRENT_DATE\b/gi, `'${today}'`);

    // console.log("Patched SQL:", safeSQL);

    // 3. Execute safe SQL
    const result = await executeSQL(sqlQuery);

    // 4. Return results
    res.json({ success: true, query: sqlQuery, result });
  // } catch (error) {
  //   console.error("Chatbot Error:", error);
  //   res.status(500).json({ success: false, message: "An error occurred." });
  // }
});

export default router;