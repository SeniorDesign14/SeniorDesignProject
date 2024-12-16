const { Sequelize } = require('sequelize');

require('dotenv').config();
// Grab environment variables (.env file)
password = process.env.DB_PASSWORD
username = process.env.DB_USERNAME
database = process.env.DB_NAME

const sequelize = new Sequelize(database, username, password, {
    host: 'localhost',
    dialect: 'postgres'
});

// Test the connection
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }