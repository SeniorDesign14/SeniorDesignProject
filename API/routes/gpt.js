import express from 'express';
import { askGPT } from '../services/gptService.js'; // adjust if using .ts
import { executeQuery } from '../database.js'; // adjust if needed

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;

  try {
    const sql = await askGPT(question);
    const result = await executeQuery(sql);
    res.json({ response: JSON.stringify(result.rows, null, 2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;
