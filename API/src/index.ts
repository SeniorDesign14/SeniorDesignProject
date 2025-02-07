import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGPT } from "./gptService";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/chat", async (req, res) => {
//   const { message } = req.body;
//   const reply = await askGPT(message);
//   res.json({ reply });
// });

// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running successfully!" });
});

app.post("/gpt", async (req, res) => {
  res.json({ response: "GPT API working!" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});