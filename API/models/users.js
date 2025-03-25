import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import the connection to the database

 
class Users extends Model {}

Users.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ssouserid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true, // if we have ssouserid we dont need username
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // if we have ssouserid we dont need email
        },
        isstudent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
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