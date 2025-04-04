import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database
 
class NutritionalInfo extends Model {}
 
NutritionalInfo.init(
    {
        foodid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            // autoIncrement: true,
        },
        food: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        servingspercontainer: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        servingsize: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalfat: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        totalfatdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        saturatedfat: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        saturatedfatdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        transfat: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        cholesterol: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        cholesteroldv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sodium: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        sodiumdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        carbs: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        carbsdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fiber: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        fiberdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sugars: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        addedsugars: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        addedsugarsdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        protein: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        calcium: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        calciumdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        iron: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        irondv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        vitamind: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        vitaminddv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        potassium: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        potassiumdv: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'nutritionalinfo',
        tableName: 'nutritionalinfo',
        timestamps: false
    }
);
 
// define association with menu once its up
 
export default NutritionalInfo;