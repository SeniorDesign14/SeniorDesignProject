import sequelize from "../db.js";
import { Op } from "sequelize";
import DiningHall from "../models/diningHall.js";
import Menu from "../models/menuItem.js";

// Validate if a dining hall exists
export async function isValidDiningHall(name) {
  try {
    const result = await DiningHall.findOne({
      where: {
        location: {
          [Op.iLike]: `%${name.trim()}%`,
        },
      },
    });
    return !!result;
  } catch (err) {
    console.error("Validation error:", err);
    return false;
  }
}

// Validate if a food item exists
export async function isValidFoodItem(input) {
  try {
    const result = await Menu.findOne({
      where: {
        food: {
          [Op.iLike]: `%${input.trim()}%`,
        },
      },
    });
    return !!result;
  } catch (error) {
    console.error("Error validating food item:", error);
    return false;
  }
}

// Validate date string format (YYYY-MM-DD)
export function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Get all dining hall names
export async function getAllDiningHalls() {
  try {
    const halls = await DiningHall.findAll({ attributes: ["hallname"] });
    return halls.map((h) => h.getDataValue("hallname").toLowerCase());
  } catch (error) {
    console.error("Error fetching dining halls:", error);
    return [];
  }
}

// Get all food item names
export async function getAllFoodItems() {
  try {
    const items = await Menu.findAll({ attributes: ["food"] });
    return items.map((i) => i.getDataValue("food").toLowerCase());
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
}
