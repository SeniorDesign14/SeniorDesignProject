import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database
 
class Menu extends Model {}
 
Menu.init(
    {
        foodid: {
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
        tableName: 'menu',
        timestamps: false,
    }
);
 
// define associations
Menu.associate = (models) => {
    Menu.hasMany(models.FoodImages, {
        foreignKey: 'foodid',
        as: 'images',
    });
};
 
export default Menu;