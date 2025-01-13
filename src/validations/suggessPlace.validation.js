const Joi = require("joi");

const addSuggessPlace = {
  body: Joi.object().keys({
    placeId: Joi.string().required(),
  }),
};


module.exports = {
  addSuggessPlace,
};
