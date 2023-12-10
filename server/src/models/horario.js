const db = require('../db/database');
const {DataTypes} = require ('sequelize');

const Horario = db.define('horario', {
      id: {
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false

      },
      horaDesde: {
         type : DataTypes.TIME,
         allowNull:false
      },

      horaHasta: {
          type: DataTypes.TIME,
          allowNull: false,
      },
      lunes:{
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      martes: {
         type: DataTypes.BOOLEAN,
         allowNull: false
      },
      miercoles: {
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      jueves: {
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      viernes: {
         type: DataTypes.BOOLEAN,
         allowNull: false
      }
 
      },
      {
        tableName: 'horario',
        createdAt: false,
        updatedAt: false
      }
);

module.exports = Horario;

