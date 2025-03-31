import sequelize from "../db";
import { QueryTypes, Op } from "sequelize";
import DiningHall from "../models/diningHall";
import Menu from "../models/menuItem";

// Validate if a dining hall exists
export async function isValidDiningHall(name: string): Promise<boolean> {
  try {
    const result = await DiningHall.findOne({
      where: {
        location: {
          [Op.iLike]: `%${name.trim()}%`, // <- must match the actual column name
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
export async function isValidFoodItem(input: string): Promise<boolean> {
  try {
    const result = await Menu.findOne({
      where: {
        food: {
          [Op.iLike]: `%${input.trim()}%`  // partial + case-insensitive match
        }
      }
    });
    return !!result;
  } catch (error) {
    console.error("Error validating food item:", error);
    return false;
  }
}
// Validate date string format (YYYY-MM-DD)
export const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export async function getAllDiningHalls(): Promise<string[]> {
  try {
    const halls = await DiningHall.findAll({ attributes: ["hallname"] });
    return halls.map((h) => h.getDataValue("hallname").toLowerCase());
  } catch (error) {
    console.error("Error fetching dining halls:", error);
    return [];
  }
}

export async function getAllFoodItems(): Promise<string[]> {
  try {
    const items = await Menu.findAll({ attributes: ["food"] });
    return items.map((i) => i.getDataValue("food").toLowerCase());
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
}