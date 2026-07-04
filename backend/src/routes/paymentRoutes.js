const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All payment routes require authentication
router.use(authenticate);

// Get receipt for an application
router.get('/:applicationId/receipt', paymentController.getReceipt);

module.exports = router;
