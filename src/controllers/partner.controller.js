const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { partnerService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const listPartner = catchAsync(async (req, res) => {
  const data = await partnerService.listPartner();
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Lấy danh sách đối tác thành công"));
});

const createPartner = catchAsync(async (req, res) => {
  const data = await partnerService.createPartner(req.body);
  res.status(httpStatus.OK).json(responseData(data, "Tạo đối tác thành công"));
});

const updatePartner = catchAsync(async (req, res) => {
  const faq = await partnerService.findPartnerById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await partnerService.updatePartner(req.params.id, req.body);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await partnerService.findPartnerById(req.params.id);
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Chỉnh sửa thông tin đối tác thành công"));
});

const DeletePartner = catchAsync(async (req, res) => {
  const faq = await partnerService.findPartnerById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await partnerService.deletePartner(req.params.id);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData({}, "Xoá đối tác thành công"));
});

module.exports = {
  listPartner,
  createPartner,
  updatePartner,
  DeletePartner,
};
