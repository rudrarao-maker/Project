const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { bookAppointment, getMyAppointments, cancelAppointment } = require('../controllers/appointmentController');

router.use(authenticate);

router.post('/', bookAppointment);
router.get('/', getMyAppointments);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
