const express = require("express");
const router = express.Router();

router.use("/", require("./authRoutes"));
router.use("/tasks", require("./taskRoutes"));

module.exports = router;
