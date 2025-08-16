const Joi = require('joi');
exports.create = Joi.object({ name: Joi.string().min(1).required(), description: Joi.string().allow('', null), active: Joi.boolean().default(true) });
exports.update = Joi.object({ name: Joi.string().min(1), description: Joi.string().allow('', null), active: Joi.boolean() });
exports.list = Joi.object({ page: Joi.number().integer().min(1).default(1), pageSize: Joi.number().integer().min(1).max(1000).default(50), name: Joi.string().allow('', null).default(''), order: Joi.string().valid('asc', 'desc').default('asc') });


exports.createDetail = Joi.object({
    book_id: Joi.number().integer().min(1).required(),
    name: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    book_data: Joi.string().allow('', null),
    active: Joi.boolean().default(true)
});

exports.updateDetail = Joi.object({
    name: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    book_data: Joi.string().allow('', null),
    active: Joi.boolean()
});

