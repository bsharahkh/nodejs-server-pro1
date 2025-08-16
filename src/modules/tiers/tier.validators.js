const Joi = require('joi');
exports.create = Joi.object({ name: Joi.string().min(1).required(), description: Joi.string().allow('', null), price: Joi.number().precision(9).min(0).default(0), duration_days: Joi.number().integer().min(1).default(30), active: Joi.boolean().default(true) });
exports.update = Joi.object({ name: Joi.string().min(1), description: Joi.string().allow('', null), price: Joi.number().precision(9).min(0), duration_days: Joi.number().integer().min(1), active: Joi.boolean() });
exports.list = Joi.object({ page: Joi.number().integer().min(1).default(1), pageSize: Joi.number().integer().min(1).max(1000).default(50), name: Joi.string().allow('', null).default(''), order: Joi.string().valid('asc','desc').default('asc') });

