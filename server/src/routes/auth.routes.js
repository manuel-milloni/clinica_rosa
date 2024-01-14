const {Router} = require('express');
const {login} = require('../controllers/auth.controllers');
const { verifyTokenFront } = require('../utils/validation.token');

const router = Router();

router.post('/', login);
router.get('/', verifyTokenFront);

module.exports = router;