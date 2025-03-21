import sequelize from "../db";

export async function executeSQL(sql: string): Promise<any> {
  try {
    const [results] = await sequelize.query(sql);
    return results;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw new Error("Failed to execute query.");
  }
}