const router = require("express").Router();
const { trackApplication } = require("../controllers/trackController");

router.get("/track/:applicationNumber", trackApplication);

module.exports = router;
