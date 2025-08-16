const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const bookRoutes = require("../modules/books/book.routes");
const tierRoutes = require("../modules/tiers/tier.routes");
const accessRoutes = require("../modules/access/access.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/tiers", tierRoutes);
router.use("/access", accessRoutes); // admin access mgmt + logs

module.exports = router;
