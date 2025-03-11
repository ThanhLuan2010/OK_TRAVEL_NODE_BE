const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { BookingService } = require("../services");
const { responseData } = require("../utils/responseFormat");

const bookingHotel = catchAsync(async (req, res) => {
  const data = await BookingService.bookingHotel(req);
  res.status(httpStatus.OK).json(responseData(data, "Đặt phòng thành công"));
});

const bookingTour = catchAsync(async (req, res) => {
  const data = await BookingService.bookingTour(req);
  res.status(httpStatus.OK).json(responseData(data, "Đặt tour thành công"));
});

module.exports = {
  bookingHotel,
  bookingTour
};
