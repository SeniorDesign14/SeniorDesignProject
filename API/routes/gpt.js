import express from 'express';
import { askGPT } from '../services/gptService.js'; // adjust if using .ts
import sequelize from '../database.js'; // adjust if needed

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;
  console.log(question);

  try {
    const sql = await askGPT(question);
    console.log(sql);
  
    const result = await sequelize.query(sql);
    if (result[0].length === 0) {
      return res.json({ response: "Nothing found." });
    }
    res.json({ response: JSON.stringify(result[0], null, 2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;
