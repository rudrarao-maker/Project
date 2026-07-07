const router = require("express").Router();
const { getMessageHistory, askAssistant } = require("../controllers/chatController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/history", getMessageHistory);
router.post("/ask", askAssistant);

module.exports = router;
