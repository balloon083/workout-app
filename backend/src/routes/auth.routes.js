const { Router } = require('express');
const auth = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);

module.exports = router;
