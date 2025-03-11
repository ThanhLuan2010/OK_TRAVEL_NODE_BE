const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { blogService, introduceService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const getIntroduce = catchAsync(async (req, res) => {
  const { type } = req.query;
  const data = await introduceService.getIntroduce(type);
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Lấy thông tin thành công"));
});

const createIntroduce = catchAsync(async (req, res) => {
  const introduce = await introduceService.findIntroduceByType(req.body.type);
  if (introduce) {
    res.status(400).json({
      data: {},
      message: "Thông tin đã tồn tại",
      code: 400,
    });
  } else {
    const data = await introduceService.createIntroduce(req.body);
    res
      .status(httpStatus.OK)
      .json(responseData(data, "Tạo thông tin thành công"));
  }
});

const updateIntroduce = catchAsync(async (req, res) => {
  const introduce = await introduceService.findIntroduceById(req.params.id);
  if (!introduce) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await introduceService.updateIntroduce(
    req.params.id,
    req.body
  );
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlogCategory(req.params.id);
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Chỉnh sửa thông tin thành công"));
});

const DeleteIntroduce = catchAsync(async (req, res) => {
  const introduce = await introduceService.findIntroduceById(req.params.id);
  if (!introduce) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await introduceService.deleteIntroduce(req.params.id);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData({}, "Xoá thông tin thành công"));
});

module.exports = {
  getIntroduce,
  createIntroduce,
  updateIntroduce,
  DeleteIntroduce,
};
