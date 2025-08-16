const express = require("express");
const ctrl = require("./auth.controller");
const router = express.Router();

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/verify-email", ctrl.verifyEmail);
router.post("/reset/send-code", ctrl.resetSend);
router.post("/reset/verify", ctrl.resetVerify);
router.post("/google", ctrl.googleLogin);

module.exports = router;
