const Joi = require("joi");

exports.signup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.verifyEmail = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

exports.resetSend = Joi.object({ email: Joi.string().email().required() });

exports.resetVerify = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

exports.google = Joi.object({ token: Joi.string().required() });
