const svc = require("./access.service");

exports.books = async (req, res, next) => {
  try {
    const out = await svc.listBooks({
      userId: req.user.userId,
      isAdmin: req.user?.roles?.includes("admin"),
      page: parseInt(req.query.page || "1", 10),
      pageSize: parseInt(req.query.pageSize || "10", 10),
      order: req.query.order || "asc",
      name: req.query.name || "",
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.availableBooks = async (req, res, next) => {
  try {
    const out = await svc.listAvailableBooks({
      userId: req.user.userId,
      isAdmin: req.user?.roles?.includes("admin"),
      page: parseInt(req.query.page || "1", 10),
      pageSize: parseInt(req.query.pageSize || "10", 10),
      order: req.query.order || "asc",
      name: req.query.name || "",
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};