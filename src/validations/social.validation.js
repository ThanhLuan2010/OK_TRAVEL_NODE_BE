const Joi = require("joi");

const createSocial = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const updateSocial = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const deleteSocial = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createSocial,
  updateSocial,
  deleteSocial,
};
