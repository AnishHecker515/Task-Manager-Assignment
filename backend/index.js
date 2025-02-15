const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config");
const path = require("path");
const Task = require("./models/Task"); // ✅ Import Task model

const app = express();
connectDB();

// 🔹 Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Session Configuration
app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/taskmanager",
    }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);

// 🔹 Ensure Authentication Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// 🔹 Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/", authRoutes);
app.use("/", taskRoutes);

// ✅ Login Page
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

// ✅ Dashboard Page (with Read, Edit, Delete, and Status Update)
app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.userId });
    res.render("dashboard", { user: req.session.user, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.render("dashboard", { user: req.session.user, tasks: [] });
  }
});

// ✅ Edit Task (Update title, description, and due date)
app.post("/tasks/edit/:id", requireAuth, async (req, res) => {
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

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ Update Task Status (Pending, In Progress, Completed)
app.post("/tasks/update/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
});

// ✅ Delete Task
app.post("/tasks/delete/:id", requireAuth, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});


// 🔹 Load Edit Page
app.get("/tasks/edit/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.session.userId });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.render("editTask", { task });
  } catch (error) {
    res.status(500).send("Error loading task");
  }
});

// 🔹 Handle Task Editing
app.post("/tasks/edit/:id", requireAuth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, description, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Error updating task");
  }
});

// ✅ Server Start
app.listen(8000, () => console.log("✅ Server running on http://localhost:8000"));
