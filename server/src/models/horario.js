const db = require('../db/database');
const {DataTypes} = require ('sequelize');

const Horario = db.define('horario', {
      id: {
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false

      },
      fromTime: {
         type : DataTypes.TIME,
         allowNull:false
      },

      toTime: {
          type: DataTypes.TIME,
          allowNull: false,
      },
      monday:{
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      tuesday: {
         type: DataTypes.BOOLEAN,
         allowNull: false
      },
      wednesday: {
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      thursday: {
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      friday: {
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

