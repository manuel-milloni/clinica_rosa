const {Router} = require('express');
const {getAll, create, edit, remove, getOne, getProfesionalesByHorario} = require('../controllers/horario.controlles');


const router = Router();

router.get('/', getAll );
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', edit);
router.delete('/:id', remove);
router.get('/profesionales/:id', getProfesionalesByHorario);

module.exports = router;