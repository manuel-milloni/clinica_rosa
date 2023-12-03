const express = require('express');

const router = express.Router();
const {getAll, create, edit, remove, getOne} = require('../controllers/obraSocial.controllers');


router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', edit);
router.delete('/:id', remove);

module.exports = router;


