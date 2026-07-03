const router = require('express').Router();
const { getMenu, updateMenu } = require('../controllers/menuController');
const auth = require('../middleware/auth');

router.get('/:name', getMenu);
router.post('/', auth, updateMenu);

module.exports = router;