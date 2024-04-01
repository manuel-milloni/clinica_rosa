const {Router} = require('express');
const {create, getAll, getOne, edit, getAllByProfesionalAndFecha, getPaciente, getTurnosProfesionalByFecha, getTurnosByPaciente, getTurnosByFecha, getTurnosByFechaAndProfesional, getTurnoByPacFechaHora, getTurnosByProfesional, remove} = require('../controllers/turno.controllers');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', edit);
// router.put('/update/:id', cancelarTurno);
router.delete('/:id', remove);

router.get('/paciente/:id', getPaciente);
router.get('/paciente/mis-turnos/:id', getTurnosByPaciente);
router.post('/paciente/:id', getTurnoByPacFechaHora);

router.post('/informes', getTurnosByFecha);

router.post('/profesional/informes/:id', getTurnosByFechaAndProfesional);
router.post('/profesional/:id', getAllByProfesionalAndFecha);
router.post('/profesional/turnos/:id', getTurnosByProfesional);
module.exports = router;


// router.post('/profesional/:id', getAllByProfesionalAndFecha);
// router.post('/profesional/:id', getTurnosProfesionalByFecha);

