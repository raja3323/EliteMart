const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);   // All cart routes require login
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:cart_id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
