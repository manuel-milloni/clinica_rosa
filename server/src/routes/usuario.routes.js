const {Router} = require('express');
const {getAllPacientes, getAllPersonal, getAllProfesionales, getOne, 
    remove, edit, createPaciente, createProfesional, createPersonal, 
    usuarioLogueado, getObrasSociales, updateProfesional, getProfesionalesByEspecialidad} = require('../controllers/usuario.controllers');

const {auth} = require('../utils/validation.token');
const router = Router();
//Borrar
const {getAll} = require('../controllers/usuario_obra_social.controllers');

router.get('/paciente', getAllPacientes );
router.post('/paciente', createPaciente);

router.get('/profesional', getAllProfesionales);
router.get('/profesional/:id', getObrasSociales);
router.post('/profesional', createProfesional);
router.put('/profesional/:id', updateProfesional);
router.get('/profesional/especialidad/:id', getProfesionalesByEspecialidad);

router.get('/personal', getAllPersonal);
router.post('/personal', createPersonal);

router.delete('/usuario/:id', remove);
router.put('/usuario/:id', edit);
router.get('/usuario/:id', getOne);
router.get('/usuario', auth, usuarioLogueado);

//se uso para testear getall en usuario_obra_social dado que hacia un select a un id inexistente que crea sequelize por defecto(se soluciona al sincronizar el modelo con la DB)
router.get('/test', getAll);


module.exports = router;


