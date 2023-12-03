const {Sequelize} = require('sequelize');
const dotenv = require('dotenv/config');

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql'
});

module.exports = db;


