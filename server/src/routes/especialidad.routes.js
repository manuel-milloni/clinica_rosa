const {Router} = require('express');
const {getAll, getOne, create, edit, remove} = require('../controllers/especialidad.controllers');
const {auth} =require('../utils/validation.token')

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', edit);
router.delete('/:id', remove);

module.exports = router;