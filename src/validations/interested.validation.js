const Joi = require('joi');
const { ENTITY } = require('../constant/entity.constant');

const action = {
  body: Joi.object().keys({
    type: Joi.string()
      .valid(...Object.values(ENTITY))
      .required(),
    ref_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  }),
};

module.exports = {
  action,
};
