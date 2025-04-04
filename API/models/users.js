import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

 
class Users extends Model {}

Users.init(
    {
        netid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // if we have ssouserid we dont need email
        },
        isstudent: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        createdat: {
            type: DataTypes.TIME,
            allowNull: true, // createdat not necessary ig
        },
        updatedat: {
            type: DataTypes.TIME,
            allowNull: true, // updatedat not necessary ig
        },
    },
    {
        sequelize,
        modelName: 'users',
        timestamps: true, // need timestamps for createdat, updatedat
        // connect the timestamps to the database columns
        createdAt: 'createdat',
        updatedAt: 'updatedat',
    }
);
 
export default Users;