const { Router } = require('express');
const requireAuth = require('../middleware/auth');
const programs = require('../controllers/programs.controller');

const router = Router();
router.use(requireAuth);

router.get('/', programs.list);
router.post('/', programs.create);
router.delete('/:id', programs.remove);

module.exports = router;
