const v = require("./book.validators");
const svc = require("./book.service");

const validate = (schema, payload) => {
  const { error, value } = schema.validate(payload, { abortEarly: false });
  if (error) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = error.details.map((d) => d.message);
    throw err;
  }
  return value;
};

exports.list = async (req, res, next) => {
  try {
    const q = validate(v.list, req.query);
    const out = await svc.listBooks({
      ...q,
      isAdmin: req.user?.roles?.includes("admin"),
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = validate(v.create, req.body);
    const out = await svc.createBook(body);
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const body = validate(v.update, req.body);
    const out = await svc.updateBook(parseInt(req.params.id, 10), body);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await svc.deleteBook(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

exports.listDetails = async (req, res, next) => {
  try {
    const items = await svc.listBookDetails({
      bookId: parseInt(req.params.bookId, 10),
      isAdmin: req.user?.roles?.includes("admin"),
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    const detail = await svc.readBookDetailWithAccess({
      userId: req.user.userId,
      bookDetailId: parseInt(req.params.detailId, 10),
      isAdmin: req.user?.roles?.includes("admin"),
    });
    res.json(detail);
  } catch (e) {
    next(e);
  }
};

exports.createDetail = async (req, res, next) => {
  try {
    const body = validate(v.createDetail, req.body);
    const out = await svc.createBookDetail(body);
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.updateDetail = async (req, res, next) => {
  try {
    const body = validate(v.updateDetail, req.body);
    const out = await svc.updateBookDetail(parseInt(req.params.id, 10), body);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.removeDetail = async (req, res, next) => {
  try {
    await svc.deleteBookDetail(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
