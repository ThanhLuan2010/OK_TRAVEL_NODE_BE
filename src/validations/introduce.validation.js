const Joi = require("joi");
const { TYPE_INTRODUCR } = require("../constant/introduce.contant");

const createIntoduce = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    type: Joi.string()
      .required()
      .custom((value, helper) => {
        const match = Object.values(TYPE_INTRODUCR).includes(value);
        if (match) {
          return value;
        } else {
          return helper.message("Loại dữ liệu không đúng");
        }
      }),
  }),
};

const updateIntoduce = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    type: Joi.string()
    .required()
    .custom((value, helper) => {
      const match = Object.values(TYPE_INTRODUCR).includes(value);
      if (match) {
        return value;
      } else {
        return helper.message("Loại dữ liệu không đúng");
      }
    }),
  }),
};

const deleteIntoduce = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const getIntroduce = {
  query: Joi.object().keys({
    type: Joi.string()
      .required()
      .custom((value, helper) => {
        const match = Object.values(TYPE_INTRODUCR).includes(value);
        if (match) {
          return value;
        } else {
          return helper.message("Loại dữ liệu không đúng");
        }
      }),
  }),
};

module.exports = {
  createIntoduce,
  updateIntoduce,
  deleteIntoduce,
  getIntroduce,
};
