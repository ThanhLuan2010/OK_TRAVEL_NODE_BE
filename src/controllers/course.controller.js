const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { faqService, courseService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const listCourse = catchAsync(async (req, res) => {
  const data = await courseService.listCourse();
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Lấy danh sách khoá học thành công"));
});

const createCourse = catchAsync(async (req, res) => {
  const { title, description, thumnail, videoUrl } = req.body;
  const data = await courseService.createCourse({
    title,
    description,
    thumnail,
    videoUrl,
  });
  res.status(httpStatus.OK).json(responseData(data, "Tạo khoá học thành công"));
});

const updateCourse = catchAsync(async (req, res) => {
  const faq = await courseService.findCourseById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await courseService.updateCourse(req.params.id, req.body);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await courseService.findCourseById(req.params.id);
  res
    .status(httpStatus.OK)
    .json(responseData(data, "Chỉnh sửa khoá học thành công"));
});

const DeleteCourse = catchAsync(async (req, res) => {
  const faq = await courseService.findCourseById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await courseService.deleteCourse(req.params.id);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData({}, "Xoá khoá học thành công"));
});

module.exports = {
  listCourse,
  createCourse,
  updateCourse,
  DeleteCourse,
};
