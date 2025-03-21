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
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
// Initialize Sequelize with PostgreSQL credentials
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Set to 'true' for debugging
});
// Test the connection
// sequelize
//   .authenticate()
//   .then(() => console.log("PostgreSQL Connected"))
//   .catch((err) => console.error("PostgreSQL Connection Error:", err));
if (require.main === module) { // Ensures this runs only when executed directly
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log("✅ Database connection successful!");
            process.exit(0);
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            process.exit(1);
        }
    }))();
}
exports.default = sequelize;
