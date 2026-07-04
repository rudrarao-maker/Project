const router = require('express').Router();
const { submitApplication, getMyApplications, getApplicationById, updateApplication } = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');
const { applicationValidator } = require('../validators/applicationValidator');

router.use(authenticate);

router.post('/', applicationValidator, submitApplication);
router.get('/', getMyApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);

module.exports = router;
