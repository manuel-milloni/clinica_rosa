const {Router} = require('express');
const {create, getAll, getOne, remove, edit, getAllByProfesionalAndFecha, getPaciente, getTurnosProfesionalByFecha, getTurnosByPaciente, getTurnosByFecha, getTurnosByFechaAndProfesional} = require('../controllers/turno.controllers');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.post('/profesional/:id', getAllByProfesionalAndFecha);
router.put('/:id', edit);
router.delete('/:id', remove);
router.get('/paciente/:id', getPaciente);

router.get('/paciente/mis-turnos/:id', getTurnosByPaciente);

router.post('/informes', getTurnosByFecha);
router.post('/profesional/informes/:id', getTurnosByFechaAndProfesional);

module.exports = router;


// router.post('/profesional/:id', getAllByProfesionalAndFecha);
// router.post('/profesional/:id', getTurnosProfesionalByFecha);

