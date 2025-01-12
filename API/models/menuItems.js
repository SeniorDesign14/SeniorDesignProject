const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import the connection to the database

class MenuItems extends Model {}

MenuItems.init(
    {
        menuItemsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        foodName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageLink: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'menuItems',
    }
);

module.exports = MenuItems;