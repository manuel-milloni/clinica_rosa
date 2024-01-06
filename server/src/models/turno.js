const db = require('../db/database');
const {DataTypes} = require('sequelize');
const Usuario = require('./usuario');

const Turno = db.define('turno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {len: [1,45]}
    },
    observaciones: {
        type: DataTypes.TEXT('long'),
        allowNull: true
       
    },
    id_profesional: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
}, 
 {
   tableName: 'turno',
   createdAt: false,
   updatedAt: false
 }

);



module.exports = Turno;