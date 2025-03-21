import { Router } from "express";
import sequelize from "../db"; 
import { QueryTypes } from "sequelize";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const menuItems = await sequelize.query("SELECT * FROM menu", {
      type: QueryTypes.SELECT,
    });
    res.json(menuItems);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

export default router;

