const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the connection to the database

class DiningHalls extends Model {}

DiningHalls.init(
    {
        diningHallId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'diningHalls',
    }
);

module.exports = DiningHalls;