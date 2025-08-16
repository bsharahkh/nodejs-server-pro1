const Joi = require("joi");
const svc = require("./auth.service");
const v = require("./auth.validators");

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

exports.signup = async (req, res, next) => {
  try {
    const data = validate(v.signup, req.body);
    const out = await svc.signup(data);
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = validate(v.login, req.body);
    const out = await svc.login(data);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const data = validate(v.verifyEmail, req.body);
    const out = await svc.verifyEmail(data);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.resetSend = async (req, res, next) => {
  try {
    const data = validate(v.resetSend, req.body);
    const out = await svc.resetSend(data);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.resetVerify = async (req, res, next) => {
  try {
    const data = validate(v.resetVerify, req.body);
    const out = await svc.resetVerify(data);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const data = validate(v.google, req.body);
    const out = await svc.googleLogin(data);
    res.json(out);
  } catch (e) {
    next(e);
  }
};
