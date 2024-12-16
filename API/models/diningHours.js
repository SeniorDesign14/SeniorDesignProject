const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the connection to the database

class DiningHours extends Model {}

DiningHours.init(
    {
        diningHourId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        diningHallId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'DiningHalls', // Name of the target model
                key: 'id', // Key in the target model that the foreign key refers to
            },
        },
        dayOfWeek: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mealPeriod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hours: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'diningHours',
    }
);

module.exports = DiningHours;