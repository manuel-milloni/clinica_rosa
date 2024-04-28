const {Sequelize} = require('sequelize');
const config = require('../configs/config');

const db = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
      host: config.mysql.host,
      port : 3306,
      dialect: 'mysql'
});

module.exports = db;


