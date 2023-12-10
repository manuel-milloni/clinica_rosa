const db = require('../db/database');
const {DataTypes} = require ('sequelize');

const ObraSocial = db.define('obra_social', {
       id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false 
       },
       nombre: {
           type: DataTypes.STRING,
           allowNull: false,
           validate: { len: [3,20]} 
       },
       descripcion: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: { len: [1, 255]}
       } 
       }, {
           tableName: 'obra_social',
           createdAt: false,
           updatedAt: false
       });

module.exports = ObraSocial;


