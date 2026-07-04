const router = require("express").Router();
const {
  getLockerItems,
  addItem,
  deleteItem,
} = require("../controllers/lockerController");
const { authenticate } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Simple multer setup for locker uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/locker");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.use(authenticate);

router.get("/", getLockerItems);
router.post("/", upload.single("document"), addItem);
router.delete("/:id", deleteItem);

module.exports = router;
