const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const { responseData, responseMessage } = require('../utils/responseFormat');

const listCategory = catchAsync(async (req, res) => {
  const data = await blogService.listBlogCategory();
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const detailBlogCategory = catchAsync(async (req, res) => {
  const data = await blogService.detailBlogCategory(req.params.id);
  if (!data) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  if (data.is_delete || data.is_hidden) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const createBlogCategory = catchAsync(async (req, res) => {
  const blogCategoryId = await blogService.createNewBlogCategory(req.body);
  if (!blogCategoryId) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseMessage('Error', httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlogCategory(blogCategoryId);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const updateBlogCategory = catchAsync(async (req, res) => {
  const blogCategory = await blogService.findBlogCategoryById(req.params.id);
  if (!blogCategory) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  const update = await blogService.updateBlogCategory(req.params.id, req.body);
  if (!update) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseMessage('Error', httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlogCategory(req.params.id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const listAdminCategory = catchAsync(async (req, res) => {
  const data = await blogService.listAdminBlogCategory(req.query);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const detailAdminBlogCategory = catchAsync(async (req, res) => {
  const data = await blogService.detailBlogCategory(req.params.id);
  if (!data) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

//============================================================================

const listBlog = catchAsync(async (req, res) => {
  const data = await blogService.listBlog(req.query);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const createBlog = catchAsync(async (req, res) => {
  const blogCategory = await blogService.findBlogCategoryById(req.body.blog_category_id);
  if (!blogCategory) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid Blog Category', httpStatus.BAD_REQUEST));
  }
  const newBlogId = await blogService.createNewBlog(req.user.id, req.body);
  if (!newBlogId) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseMessage('Error', httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlog(newBlogId);
  data.blog_category = await blogService.detailBlogCategory(data.blog_category_id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogService.findBlogById(req.params.id);
  if (!blog) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid Blog', httpStatus.BAD_REQUEST));
  }
  const blogCategory = await blogService.findBlogCategoryById(req.body.blog_category_id);
  if (!blogCategory) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid Blog Category', httpStatus.BAD_REQUEST));
  }
  const isUpdate = await blogService.updateBlog(req.params.id, req.body);
  if (!isUpdate) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseMessage('Error', httpStatus.INTERNAL_SERVER_ERROR));
  }
  const data = await blogService.detailBlog(req.params.id);
  data.blog_category = await blogService.detailBlogCategory(data.blog_category_id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const detailBlog = catchAsync(async (req, res) => {
  const data = await blogService.detailBlog(req.params.id);
  if (!data) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  if (data.is_delete || data.is_hidden) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  data.blog_category = await blogService.detailBlogCategory(data.blog_category_id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const detailAdminBlog = catchAsync(async (req, res) => {
  const data = await blogService.detailBlog(req.params.id);
  if (!data) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('No Data', httpStatus.BAD_REQUEST));
  }
  data.blog_category = await blogService.detailBlogCategory(data.blog_category_id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const listAdminBlog = catchAsync(async (req, res) => {
  const data = await blogService.listAdminBlog(req.query);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

module.exports = {
  createBlogCategory,
  detailBlogCategory,
  listCategory,
  updateBlogCategory,
  listAdminCategory,
  detailAdminBlogCategory,
  listBlog,
  createBlog,
  updateBlog,
  detailBlog,
  detailAdminBlog,
  listAdminBlog,
};
