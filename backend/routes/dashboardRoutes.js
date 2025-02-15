// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// // Ensure user is authenticated
// const requireAuth = (req, res, next) => {
//   if (!req.session.userId) return res.redirect("/login");
//   next();
// };

// // Dashboard Page
// router.get("/", requireAuth, async (req, res) => {
//   const user = await User.findById(req.session.userId);
//   res.render("dashboard", { user });
// });

// module.exports = router;
