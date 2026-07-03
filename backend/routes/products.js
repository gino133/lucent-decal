const router = require('express').Router();
const { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', auth, createProduct);
router.put('/:slug', auth, updateProduct);
router.delete('/:slug', auth, deleteProduct);

module.exports = router;