import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

class DiningHalls extends Model {}

DiningHalls.init(
    {
        dininghallid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        hallname: {
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
        modelName: 'dininghalls',
        timestamps: false
    }
);

// define associations
DiningHalls.associate = (models) => {
    DiningHalls.hasMany(models.DiningHours, {
        foreignKey: 'dininghallid',
        as: 'hours',
    }),
    DiningHalls.hasMany(models.DiningStations, {
        foreignKey: 'dininghallid',
        as: 'stations',
    }),
    DiningHalls.hasMany(models.ScheduleItems, {
        foreignKey: 'dininghallid',
        as: 'scheduleitems',
    });
}

export default DiningHalls;