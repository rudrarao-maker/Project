const router = require('express').Router();
const { getNews, submitContactMessage } = require('../controllers/publicController');

router.get('/news', getNews);
router.post('/contact', submitContactMessage);

module.exports = router;
