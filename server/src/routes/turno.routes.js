const {Router} = require('express');
const {create, getAll, getOne, remove, edit, getAllByProfesionalAndFecha, getPaciente} = require('../controllers/turno.controllers');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.post('/:id', getAllByProfesionalAndFecha);
router.put('/:id', edit);
router.delete('/:id', remove);
router.get('/paciente/:id', getPaciente);
router.post('/profesional/:id', getAllByProfesionalAndFecha);

module.exports = router;

