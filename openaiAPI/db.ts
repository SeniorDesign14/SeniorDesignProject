import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Initialize Sequelize with PostgreSQL credentials
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Set to 'true' for debugging
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.error("PostgreSQL Connection Error:", err));

export default sequelize;
