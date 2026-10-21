const { Router } = require('express');
const requireAuth = require('../middleware/auth');
const foods = require('../controllers/foods.controller');

const router = Router();
router.use(requireAuth);

router.get('/search', foods.search);

module.exports = router;
