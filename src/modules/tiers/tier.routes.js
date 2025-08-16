const express = require("express");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const ctrl = require("./tier.controller");

const router = express.Router();
router.use(auth);

// Admin CRUD tiers
router.post("/", role("admin"), ctrl.create);
router.put("/:id", role("admin"), ctrl.update);
router.delete("/:id", role("admin"), ctrl.remove);
router.get("/", role("admin"), ctrl.list); // admin list with access aggregation

// Upsert access rules for a tier
router.put("/:id/access", role("admin"), ctrl.upsertAccess);

// Admin reports
router.get("/_admin/subscriptions", role("admin"), ctrl.subscriptionsAdmin);
router.get("/_admin/access-logs", role("admin"), ctrl.logsAdmin);

module.exports = router;
