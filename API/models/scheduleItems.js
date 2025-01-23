import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

class ScheduleItems extends Model {}

ScheduleItems.init(
    {
        scheduleid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        scheduledate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foodid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        food: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isbreakfast: {
            type: DataTypes.BOOLEAN,
        },
        islunch: {
            type: DataTypes.BOOLEAN,
        },
        isdinner: {
            type: DataTypes.BOOLEAN,
        },
        allergens: {
            type: DataTypes.STRING,
        },
        summary: {
            type: DataTypes.TEXT,
        },
        imagelink: {
            type: DataTypes.TEXT,
        },
        diningstationid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dininghallid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'schedule',
        timestamps: false
    }
);
export default ScheduleItems;