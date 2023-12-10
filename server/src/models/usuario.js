const { DataTypes} = require ('sequelize');
const db = require('../db/database');
const Especialidad = require('./especialidad');
const Horario = require('./horario');
const ObraSocial = require('./obraSocial');


const Usuario = db.define('usuario', {
      id: {
         type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
           
      },
      
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 20]}
    },
    
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1,20]}
    },

    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 10]}
    },
    
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {len: [3, 40]}
    },

    password: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: { len: [1,255]}
    },
    matricula: {
         type: DataTypes.STRING,
         allowNull: true,
         validate: { len: [0, 10]}
    },
    
    nroAfiliado: {
           type: DataTypes.STRING,
           allowNull: true,
           validate: {len : [0,20]}
    },
    
    rol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
             model: Especialidad,
             key: 'id'
        }
    },

    id_horario: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
             model: Horario,
             key: 'id'
         }
    },
    id_obra_social: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
             model: ObraSocial,
             key: 'id',
          }
    }
  }, {
     tableName: 'usuario',
     createdAt: false,
     updatedAt: false
  }

);

Usuario.belongsTo(Especialidad, {foreignKey: 'id_especialidad', as: 'especialidad'});
Usuario.belongsTo(Horario, { foreignKey: 'id_horario', as: 'horario'});
Usuario.belongsTo(ObraSocial, { foreignKey: 'id_obra_social', as: 'obra_social'});


module.exports = Usuario;

//Roles: 0 paciente, 1 profesional, 2 personal
       