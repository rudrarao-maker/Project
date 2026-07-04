const router = require('express').Router();
const { getWallet, addFunds } = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getWallet);
router.post('/add-funds', addFunds);

module.exports = router;
