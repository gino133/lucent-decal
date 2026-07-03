const router = require('express').Router();
const { getAllPages, getPageBySlug, upsertPage, deletePage } = require('../controllers/pageController');
const auth = require('../middleware/auth');

router.get('/', getAllPages);
router.get('/:slug', getPageBySlug);
router.post('/', auth, upsertPage); // admin only
router.delete('/:slug', auth, deletePage);

module.exports = router;