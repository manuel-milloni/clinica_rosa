const db = require('../db/database');
const {DataTypes} = require('sequelize');
const Usuario = require('./usuario');
const ObraSocial = require('./obraSocial');

const Usuario_obra_social = db.define('usuario_obra_social',{
      id_profesional:{
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
          
      },
      id_obra_social:{
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true 
             
         
      }

      },{
        tableName: 'usuario_obra_social',
        createdAt: false,
        updatedAt: false
      }
      

);

Usuario_obra_social.belongsTo(Usuario, { foreignKey: 'id_profesinal', as: 'profesional'});
Usuario_obra_social.belongsTo(ObraSocial, {foreignKey: 'id_obra_social', as: 'obra_social'});

module.exports = Usuario_obra_social;

