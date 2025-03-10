const Joi = require("joi");

const createCourse = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    videoUrl: Joi.string().required(),
    thumnail: Joi.string().required(),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    videoUrl: Joi.string().required(),
    thumnail: Joi.string().required(),
  }),
};

const deleteCourse = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse
};
