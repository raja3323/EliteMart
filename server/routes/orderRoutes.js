// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { getUserOrders, placeOrder, getAllOrders } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/', getUserOrders);
router.post('/', placeOrder);
router.get('/all', adminMiddleware, getAllOrders);   // admin only

module.exports = router;
