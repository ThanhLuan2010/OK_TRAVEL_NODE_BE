const express = require("express");
const validate = require("../../middlewares/validate");
const { authJwt } = require("../../middlewares/jwtAuth");
const { bookingController } = require("../../controllers");
const { bookingValidate } = require("../../validations");

const router = express.Router();

router.post(
  "/book-hotel",
  authJwt(),
  validate(bookingValidate.bookingHotel),
  bookingController.bookingHotel
);

router.post(
    "/book-tour",
    authJwt(),
    validate(bookingValidate.bookingTour),
    bookingController.bookingTour
  );

module.exports = router;
