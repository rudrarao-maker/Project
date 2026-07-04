const router = require("express").Router();
const { getMessageHistory } = require("../controllers/chatController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/history", getMessageHistory);

module.exports = router;
