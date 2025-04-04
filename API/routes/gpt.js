import express from 'express';
import { askGPT, respondWithNaturalLanguage } from '../services/gptService.js'; // adjust if using .ts
import sequelize from '../database.js'; // adjust if needed

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;
  console.log(question);

  try {
    const sql = await askGPT(question);
    console.log("Generated SQL:", sql); 

    const [resultRows] = await sequelize.query(sql); 
    console.log("SQL Result:", resultRows); 

    if (resultRows.length === 0) {
      return res.json({ response: "Nothing found." });
    }

    const naturalResponse = await respondWithNaturalLanguage(question, resultRows); 
    return res.json({ response: naturalResponse }); 
  } catch (err) {
    console.error("Error during GPT handling:", err); 
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;
