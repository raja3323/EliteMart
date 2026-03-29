// server/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', submitFeedback);                                         // any user
router.get('/', authMiddleware, adminMiddleware, getAllFeedback);          // admin

module.exports = router;
