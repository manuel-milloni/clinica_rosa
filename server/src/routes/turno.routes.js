const {Router} = require('express');
const {create, getAll, getOne, remove, edit, getAllByProfesionalAndFecha} = require('../controllers/turno.controllers');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.post('/:id', getAllByProfesionalAndFecha);
router.put('/:id', edit);
router.delete('/:id', remove);

module.exports = router;

