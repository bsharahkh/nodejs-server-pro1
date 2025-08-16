const express = require("express");
const auth = require("../../middleware/auth");
const ctrl = require("./user.controller");

const router = express.Router();

router.use(auth);
router.get("/me", ctrl.me);
router.post("/me/subscribe", ctrl.subscribe);
router.get("/me/subscriptions", ctrl.mySubscriptions);
router.get("/me/access-log", ctrl.myAccessLog);

module.exports = router;
