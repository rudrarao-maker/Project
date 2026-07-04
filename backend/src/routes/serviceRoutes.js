const router = require('express').Router();
const { getAllServices, getServiceById } = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', getServiceById);

module.exports = router;
