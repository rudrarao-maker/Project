const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all tasks (Admin can see all, or filter by themselves/users. Users see only their own)
exports.getTasks = async (req, res) => {
  try {
    const { role, id } = req.user; // id is admin.id or user.id
    const { status, priority, type } = req.query; // type: 'assigned_to_me', 'assigned_to_users'

    let where = {};
    if (status && status !== "all") where.status = status;
    if (priority && priority !== "all") where.priority = priority;

    if (role === "user") {
      where.userId = id;
    } else {
      // Admin
      if (type === "assigned_to_users") {
        where.userId = { not: null };
      } else if (type === "assigned_to_me") {
        where.assignedToId = id;
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { name: true, email: true } },
        user: { select: { name: true, email: true } },
      },
    });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

// Create a new task (Admin only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedToId, userId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "medium",
        assignedToId: assignedToId ? parseInt(assignedToId, 10) : null,
        userId: userId ? parseInt(userId, 10) : null,
      },
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

// Update task status or details
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;
    const { role, id: authId } = req.user;

    const existingTask = await prisma.task.findUnique({ where: { id: parseInt(id, 10) } });
    if (!existingTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Users can only update their own tasks, usually just status to 'completed'
    if (role === "user" && existingTask.userId !== authId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this task" });
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id, 10) },
      data: { status, priority },
    });

    res.json({ success: true, data: task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

// Delete a task (Admin only)
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins can delete, checked by middleware
    await prisma.task.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};
