const express = require("express");
const Task = require("../models/Task");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 🔹 Ensure Authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// 🔹 Fetch Tasks
router.get("/tasks", requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 🔹 Add Task
router.post("/tasks/add", requireAuth, async (req, res) => {
  const { title, description, dueDate } = req.body;
  await Task.create({ user: req.session.userId, title, description, dueDate, status: "Pending" });
  res.redirect("/tasks");
});

// ✅ Ensure JSON response in Edit Task API
router.post("/tasks/edit/:id", requireAuth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, description, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask); // ✅ Ensure JSON response
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" }); // ✅ Send JSON, not HTML
  }
});


// 🔹 Delete Task
router.post("/tasks/delete/:id", requireAuth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/tasks");
});

// ✅ Generate PDF for a Specific Task
router.get("/tasks/export/pdf/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.session.userId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../public/task_${task._id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("Task Details", { align: "center" });
    doc.fontSize(14).text(`Title: ${task.title}`);
    doc.fontSize(14).text(`Description: ${task.description}`);
    doc.fontSize(14).text(`Status: ${task.status}`);
    doc.fontSize(14).text(`Due Date: ${new Date(task.dueDate).toLocaleDateString()}`);
    doc.end();

    // ✅ Delay for file creation before downloading
    setTimeout(() => {
      res.download(filePath);
    }, 1000);
  } catch (error) {
    console.error("Error generating PDF for task:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});


module.exports = router;
