const {Router} = require('express');
const {getAllPacientes, getAllPersonal, getAllProfesionales, getOne, remove, edit, createPaciente, createProfesional, createPersonal, usuarioLogueado} = require('../controllers/usuario.controllers');
const {auth} = require('../utils/validation.token');
const router = Router();

router.get('/paciente', getAllPacientes );
router.post('/paciente', createPaciente);

router.get('/profesional', getAllProfesionales);
router.post('/profesional', createProfesional);

router.get('/personal', getAllPersonal);
router.post('/personal', createPersonal);

router.delete('/usuario/:id', remove);
router.put('/usuario/:id', edit);
router.get('/usuario/:id', getOne);
router.get('/usuario', auth, usuarioLogueado);

module.exports = router;


