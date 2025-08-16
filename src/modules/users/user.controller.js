const svc = require("./user.service");

exports.me = async (req, res, next) => {
  try {
    const out = await svc.getProfile(req.user.userId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.subscribe = async (req, res, next) => {
  try {
    const tierId = parseInt(req.body.tier_id, 10);
    if (!tierId)
      throw Object.assign(new Error("tier_id required"), { status: 400 });
    const out = await svc.subscribeToTier({
      userId: req.user.userId,
      tierId,
      isAdmin: req.user.roles.includes("admin"),
    });
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.mySubscriptions = async (req, res, next) => {
  try {
    const rows = await svc.getMySubscriptions(req.user.userId);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

exports.myAccessLog = async (req, res, next) => {
  try {
    const rows = await svc.getMyAccessLog(req.user.userId);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};
