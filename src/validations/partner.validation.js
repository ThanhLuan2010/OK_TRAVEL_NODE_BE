const Joi = require("joi");

const createPartner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const updatePartner = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const deletePartner = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createPartner,
  updatePartner,
  deletePartner,
};
