const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { blogService, faqService } = require("../services");
const { responseData, responseMessage } = require("../utils/responseFormat");

const listFAQ = catchAsync(async (req, res) => {
  const data = await faqService.listFaq();
  res.status(httpStatus.OK).json(responseData(data, "Lấy danh sách hỏi đáp thành công"));
});

const createFaq = catchAsync(async (req, res) => {
  const { answer, question } = req.body;
  const data = await faqService.createFaq({ answer, question });
  res.status(httpStatus.OK).json(responseData(data, "Tạo hỏi đáp thành công"));
});

const updateFaq = catchAsync(async (req, res) => {
  const faq = await faqService.findFaqById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await faqService.updateFaq(req.params.id, req.body);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlogCategory(req.params.id);
  res.status(httpStatus.OK).json(responseData(data, "Chỉnh sửa hỏi đáp thành công"));
});

const DeleteFaq = catchAsync(async (req, res) => {
  const faq = await faqService.findFaqById(req.params.id);
  if (!faq) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(responseMessage("No Data", httpStatus.BAD_REQUEST));
  }
  const update = await faqService.deleteFaq(req.params.id);
  if (!update) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(responseMessage("Error", httpStatus.INTERNAL_SERVER_ERROR));
  }
  res.status(httpStatus.OK).json(responseData({}, "Xoá hỏi đáp thành công"));
});

module.exports = {
  listFAQ,
  createFaq,
  updateFaq,
  DeleteFaq,
};
