import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGPT } from "./gptService";
import menuRoutes from "./routes/menu";
import chatRoutes from './routes/chatbot';
import "./db";



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

app.use("/menu", menuRoutes);
app.use("/api", chatRoutes);

app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});


