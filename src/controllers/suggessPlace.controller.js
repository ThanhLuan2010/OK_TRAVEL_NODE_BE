const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { blogService, suggessPlaceService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const listSuggessPlace = catchAsync(async (req, res) => {
  const data = await suggessPlaceService.listSuggessPlace(req.query);
  res.status(httpStatus.OK).json(responseData(data, "Successfully"));
});

const addSuggessPlace = catchAsync(async (req, res) => {
  const response = await suggessPlaceService.addSuggessPlace(req.body);
  if (!response) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData(response, "Successfully"));
});

module.exports = {
  listSuggessPlace,
  addSuggessPlace,
};
