const router = require("express").Router();
const faqController = require("../controllers/faqController");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

// Public route to get all active FAQs
router.get("/", faqController.getAllFAQs);

// Admin route to create a new FAQ
router.post("/", authenticate, authorizeAdmin, faqController.createFAQ);

module.exports = router;
