const db = require('../db/database');
const {DataTypes} = require('sequelize');

const Especialidad = db.define('especialidad', {
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
             allowNull: false,
             validate: {len: [1,255]}
        }
        },
        {
            tableName: 'especialidad',
            createdAt: false,
            updatedAt: false
        }  
            
            );

module.exports = Especialidad;