import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

class DiningHours extends Model {}

DiningHours.init(
    {
        dininghourid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        dininghallid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'dininghalls', // Name of the target model
                key: 'dininghallid', // Key in the target model that the foreign key refers to
            },
        },
        dayofweek: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mealperiod: {
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
        modelName: 'dininghours',
        timestamps: false
    }
);

// define association to dininghalls
DiningHours.associate = (models) => {
    DiningHours.belongsTo(models.DiningHalls, {
        foreignKey: 'dininghallid',
        as: 'hall',
    });
}

export default DiningHours;