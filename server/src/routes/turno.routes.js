const {Router} = require('express');
const {create, getAll, getOne, remove, edit, getAllByProfesionalAndFecha, getPaciente, getTurnosProfesionalByFecha, getTurnosByPaciente, getTurnosByFecha, getTurnosByFechaAndProfesional, getTurnoByPacFechaHora} = require('../controllers/turno.controllers');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', edit);
router.delete('/:id', remove);

router.get('/paciente/:id', getPaciente);
router.get('/paciente/mis-turnos/:id', getTurnosByPaciente);
router.post('/paciente/:id', getTurnoByPacFechaHora);

router.post('/informes', getTurnosByFecha);

router.post('/profesional/informes/:id', getTurnosByFechaAndProfesional);
router.post('/profesional/:id', getAllByProfesionalAndFecha);
module.exports = router;


// router.post('/profesional/:id', getAllByProfesionalAndFecha);
// router.post('/profesional/:id', getTurnosProfesionalByFecha);

