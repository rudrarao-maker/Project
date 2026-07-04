const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { submitGrievance, getMyGrievances, getGrievanceById } = require('../controllers/grievanceController');

router.use(authenticate);

router.post('/', submitGrievance);
router.get('/', getMyGrievances);
router.get('/:id', getGrievanceById);

module.exports = router;
