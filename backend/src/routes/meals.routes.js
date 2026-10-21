const { Router } = require('express');
const requireAuth = require('../middleware/auth');
const meals = require('../controllers/meals.controller');

const router = Router();
router.use(requireAuth);

router.get('/', meals.list);
router.get('/today', meals.today);
router.post('/', meals.create);
router.put('/:id', meals.update);
router.delete('/:id', meals.remove);

module.exports = router;
