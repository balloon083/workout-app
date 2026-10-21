const { Router } = require('express');
const requireAuth = require('../middleware/auth');
const workouts = require('../controllers/workouts.controller');

const router = Router();
router.use(requireAuth);

router.get('/', workouts.list);
router.post('/', workouts.create);
router.delete('/:id', workouts.remove);

module.exports = router;
