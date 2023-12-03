const {Router} = require('express');
const {getAll, create, edit, remove, getOne} = require('../controllers/horario.controlles');


const router = Router();

router.get('/', getAll );
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', edit);
router.delete('/:id', remove);

module.exports = router;