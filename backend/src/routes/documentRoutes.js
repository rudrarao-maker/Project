const router = require("express").Router();
const {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  downloadDocument,
} = require("../controllers/documentController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(authenticate);

router.post("/upload", upload.single("document"), uploadDocument);
router.get("/", getMyDocuments);
router.get("/:id", getDocumentById);
router.get("/:id/download", downloadDocument);

module.exports = router;
