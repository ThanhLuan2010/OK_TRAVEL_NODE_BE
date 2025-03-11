const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { blogService, faqService, socialService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const listSocial = catchAsync(async (req, res) => {
  const data = await socialService.listSocial();
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Lấy danh sách mạng xã hội thành công"));
});

const createSocal = catchAsync(async (req, res) => {
  const data = await socialService.createSocial(req.body);
  res.status(httpStatus.OK).json(responseData(data, "Tạo mạng xã hội thành công"));
});

const updateSocal = catchAsync(async (req, res) => {
  const faq = await socialService.findSocialById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await socialService.updateSocial(req.params.id, req.body);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await socialService.findSocialById(req.params.id);
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Chỉnh sửa thông tin mạng xã hội thành công"));
});

const DeleteSocal = catchAsync(async (req, res) => {
  const faq = await socialService.findSocialById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await socialService.deleteSocial(req.params.id);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData({}, "Xoá thông tin mạng xã hội thành công"));
});

module.exports = {
  listSocial,
  createSocal,
  updateSocal,
  DeleteSocal,
};
