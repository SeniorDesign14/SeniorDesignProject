import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

// Define the structure for the menu items table
class MenuItem extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public availableToday!: boolean;
}

MenuItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    availableToday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MenuItem",
    tableName: "menu_items",
    timestamps: false,
  }
);

export default MenuItem;
