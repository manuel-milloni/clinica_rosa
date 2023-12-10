const {Sequelize} = require('sequelize');
const config = require('../configs/config');

const db = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
      host: config.mysql.host,
      dialect: 'mysql'
});

module.exports = db;


