const express = require("express");
const auth = require("../../middleware/auth");
const ctrl = require("./access.controller");

const router = express.Router();
router.use(auth);
router.get("/books", ctrl.availableBooks);
module.exports = router;
