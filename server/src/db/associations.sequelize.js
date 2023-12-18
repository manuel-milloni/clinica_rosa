const ObraSocial = require('../models/obraSocial');
const Usuario = require('../models/usuario');
const Especialidad = require('../models/especialidad')

//Establece que un usuario pertenece a una obra social
Usuario.belongsTo(ObraSocial, { foreignKey: 'id', as: 'obras_sociales'});
//Establece una relacion entre Una Obra social y muchos usuarios.
//Se crea el metodo getPacientes() que devuelve todos los usuarios que tienen una determinada obra social
//ObraSocial.belongsToMany(Usuario, {foreignKey: 'id_obra_social', as: 'pacientes'});
ObraSocial.hasMany(Usuario, { foreignKey: 'id_obra_social', as: 'pacientes' });

Usuario.belongsTo(Especialidad, {foreignKey: 'id', as: 'especialidades' });
Especialidad.hasMany(Usuario, {foreignKey: 'id_especialidad', as: 'profesionales'});


module.exports = {ObraSocial, Usuario, Especialidad};
