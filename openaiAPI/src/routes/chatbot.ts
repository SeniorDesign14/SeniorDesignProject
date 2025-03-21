import express from "express";
import { askGPT } from "../gptService";
import { executeSQL } from "../utils/queryExecutor";

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: "Chatbot route is connected!" });
});


router.post('/chat', async (req, res) => {
  const { userPrompt } = req.body;



  try {
    // 1. Ask GPT for SQL
    const sqlQuery = await askGPT(userPrompt);
    console.log("Generated SQL:", sqlQuery);

    // 2. Execute SQL
    const result = await executeSQL(sqlQuery);
    console.log("Query Result:", result);

    // 3. Return results
    res.json({ success: true, query: sqlQuery, result });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
});

export default router;