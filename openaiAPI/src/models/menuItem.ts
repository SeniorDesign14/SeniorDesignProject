import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Menu extends Model {}

Menu.init(
  {
    foodid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    food: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Menu",
    tableName: "menu",
    timestamps: false,
  }
);

export default Menu;