const router = require("express").Router();
const {
  getAllSchemes,
  getSchemeById,
  saveScheme,
  unsaveScheme,
} = require("../controllers/schemeController");
const { authenticate } = require("../middleware/auth");

router.get("/", getAllSchemes);
router.get("/:id", getSchemeById);
router.post("/:id/save", authenticate, saveScheme);
router.delete("/:id/save", authenticate, unsaveScheme);

module.exports = router;
