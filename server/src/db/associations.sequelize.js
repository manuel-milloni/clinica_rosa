const ObraSocial = require('../models/obraSocial');
const Usuario = require('../models/usuario');
const Especialidad = require('../models/especialidad')
const Horario = require('../models/horario');
const Usuario_obra_social = require('../models/usuario_obra_social');

//Establece que un Paciente pertenece a una obra social
Usuario.belongsTo(ObraSocial, { foreignKey: 'id', as: 'obras_sociales'});
//Establece una relacion entre Una Obra social y muchos usuarios.
//Se crea el metodo getPacientes() que devuelve todos los usuarios que tienen una determinada obra social
//ObraSocial.belongsToMany(Usuario, {foreignKey: 'id_obra_social', as: 'pacientes'});
ObraSocial.hasMany(Usuario, { foreignKey: 'id_obra_social', as: 'pacientes' });

//Profesional-Especialidad
Usuario.belongsTo(Especialidad, {foreignKey: 'id', as: 'especialidades' });
Especialidad.hasMany(Usuario, {foreignKey: 'id_especialidad', as: 'profesionales'});

//Profesional-Horario
Usuario.belongsTo(Horario, {foreignKey: 'id', as: 'horarios'});
Horario.hasMany(Usuario, {foreignKey: 'id_horario', as: 'profesionalesHor'});

//Profesionales - Obrasocial
Usuario_obra_social.belongsTo(Usuario, {foreignKey: 'id', as: 'obraSocialUsuario'});
Usuario.hasMany(Usuario_obra_social, {foreignKey: 'id_profesional', as: 'profesionalObraSocial'});

// una vez obtenida una elemento ObraSocial de la db, obraSocial.getObraSocialProfesional(), devuelve todos los registros de usuario_obra_social que contenga dicha obra social
ObraSocial.hasMany(Usuario_obra_social, {foreignKey: 'id_obra_social', as : 'obraSocialProfesional'}); 
Usuario_obra_social.belongsTo(ObraSocial, {foreignKey: 'id', as: 'usuarioObraSocial'});


module.exports = {ObraSocial, Usuario, Especialidad, Horario, Usuario_obra_social};

