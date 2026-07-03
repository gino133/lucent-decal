const router = require('express').Router();
const { getSetting, updateSetting } = require('../controllers/settingController');
const auth = require('../middleware/auth');

router.get('/:key', getSetting);
router.post('/', auth, updateSetting);

module.exports = router;