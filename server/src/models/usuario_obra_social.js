const db = require('../db/database');
const {DataTypes} = require('sequelize');
const Usuario = require('./usuario');
const ObraSocial = require('./obraSocial');

const Usuario_obra_social = db.define('usuario_obra_social',{
      id_profesional:{
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references : {
              model : Usuario,
              key : 'id'
          },
          onDelete : 'restrict',
          onUpdate : 'cascade',
          field: 'id_profesional'
          
      },
      id_obra_social:{
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
         references : {
            model : ObraSocial,
            key : 'id'
        },
        onDelete : 'restrict',
        onUpdate : 'cascade',
        field : 'id_obra_social' 
             
         
      }

      },{
        tableName: 'usuario_obra_social',
        createdAt: false,
        updatedAt: false,
        initialAutoIncrement: false,
        
      }
      

);



module.exports = Usuario_obra_social;

