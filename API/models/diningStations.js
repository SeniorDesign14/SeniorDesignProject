import { Model, DataTypes} from "sequelize";
import sequelize from "../database.js";

class DiningStations extends Model {}

DiningStations.init(
    {
        diningstationid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        dininghallid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'dininghalls',
                key: 'dininghallid'
            }
        },
        stationname: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'diningstations',
        timestamps: false
    }
);

// Define associations
DiningStations.associate = (models) => {
    DiningStations.belongsTo(models.DiningHalls, {
        foreignKey: 'dininghallid',
        as: 'hall'
    });
};

export default DiningStations;