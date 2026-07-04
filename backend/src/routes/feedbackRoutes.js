const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { submitFeedback, getServiceFeedback, getMyFeedback } = require('../controllers/feedbackController');

router.get('/service/:id', getServiceFeedback); // public
router.use(authenticate);
router.post('/', submitFeedback);
router.get('/my', getMyFeedback);

module.exports = router;
