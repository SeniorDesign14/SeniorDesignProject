import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database
 
class FoodImages extends Model {}
 
FoodImages.init(
    {
        imageid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        foodid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'foodimages',
        tableName: 'foodimages',
        timestamps: false,
    }
);
 
// define associations
FoodImages.associate = (models) => {
    FoodImages.belongsTo(models.Menu, {
        foreignKey: 'foodid',
        as: 'food',
    });
};
 
export default FoodImages;