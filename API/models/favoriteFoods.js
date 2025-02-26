import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

class FavoriteFoods extends Model {}

FavoriteFoods.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        foodid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        food: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdat: {
            type: DataTypes.TIME,
        },
        dininghallid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
    },
    {
        sequelize,
        modelName: 'favoritefoods',
        timestamps: true,
        createdAt: 'createdat',
        updatedAt: false,
    }
);

// TODO: define associations


export default FavoriteFoods;