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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "API is running successfully!" });
});
app.post("/gpt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ response: "GPT API working!" });
}));
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
