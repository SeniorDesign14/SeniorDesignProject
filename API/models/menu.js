import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database
 
class Menu extends Model {}
 
Menu.init(
    {
        foodID: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        modelName: 'menu',
        timestamps: false,
    }
);
 
// define associations
 
export default Menu;