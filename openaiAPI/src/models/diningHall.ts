import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class DiningHall extends Model {}

DiningHall.init(
  {
    dininghallid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hallname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DiningHall",
    tableName: "dininghalls", 
    timestamps: false,
  }
);

export default DiningHall;