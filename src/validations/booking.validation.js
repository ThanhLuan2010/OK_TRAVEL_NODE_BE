const Joi = require("joi");

const bookingHotel = {
  body: Joi.object().keys({
    checkInTime: Joi.string().required(),
    checkOutTime: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    number_adult: Joi.number().required(),
    number_children: Joi.number().required(),
    note: Joi.string().optional().allow("").allow(null),
    quantityRoom: Joi.number().required(),
    roomTypeID: Joi.string().required(),
    serviceId: Joi.string().optional().allow("").allow(null),
    mySafe:Joi.boolean().optional()
  }),
};

const bookingTour = {
  body: Joi.object().keys({
    tour_id: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    number_adult: Joi.number().required(),
    number_children: Joi.number().required(),
    note: Joi.string().optional().allow("").allow(null),
    start_date: Joi.string().required(),
  }),
};

module.exports = {
  bookingHotel,
  bookingTour
};
