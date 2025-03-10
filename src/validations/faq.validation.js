const Joi = require("joi");

const createFaq = {
  body: Joi.object().keys({
    answer: Joi.string().required(),
    question: Joi.string(),
  }),
};

const updateFaq = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    answer: Joi.string().optional(),
    question: Joi.string()?.optional(),
  }),
};

const deleteFaq = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createFaq,
  updateFaq,
  deleteFaq,
};
