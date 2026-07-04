const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

// Users and Admins can get tasks and update tasks
router.get("/", taskController.getTasks);
router.put("/:id", taskController.updateTask);

// Only admins can create or delete tasks
router.post("/", authorizeRoles("super_admin", "admin", "officer", "reviewer"), taskController.createTask);
router.delete("/:id", authorizeRoles("super_admin", "admin", "officer", "reviewer"), taskController.deleteTask);

module.exports = router;
