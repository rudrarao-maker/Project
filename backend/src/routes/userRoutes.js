const router = require('express').Router();
const { getProfile, updateProfile, uploadProfilePhoto } = require('../controllers/userController');
const { getLoginHistory, getUserActivity } = require('../controllers/userActivityController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadProfilePhoto);
router.get('/login-history', getLoginHistory);
router.get('/activity', getUserActivity);

module.exports = router;
