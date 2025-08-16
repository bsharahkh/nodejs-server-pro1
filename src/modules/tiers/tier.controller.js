const v = require("./tier.validators");
const svc = require("./tier.service");

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

exports.create = async (req, res, next) => {
  try {
    const out = await svc.create(validate(v.create, req.body));
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};
exports.update = async (req, res, next) => {
  try {
    const out = await svc.update(
      parseInt(req.params.id, 10),
      validate(v.update, req.body)
    );
    res.json(out);
  } catch (e) {
    next(e);
  }
};
exports.remove = async (req, res, next) => {
  try {
    await svc.remove(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
exports.list = async (req, res, next) => {
  try {
    const out = await svc.list(validate(v.list, req.query));
    res.json(out);
  } catch (e) {
    next(e);
  }
};
exports.upsertAccess = async (req, res, next) => {
  try {
    const out = await svc.upsertAccess({
      ...req.body,
      tier_id: parseInt(req.params.id, 10),
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};
exports.subscriptionsAdmin = async (req, res, next) => {
  try {
    const out = await svc.getSubsAdmin(req.query);
    res.json(out);
  } catch (e) {
    next(e);
  }
};
exports.logsAdmin = async (req, res, next) => {
  try {
    const out = await svc.getLogsAdmin(req.query);
    res.json(out);
  } catch (e) {
    next(e);
  }
};
