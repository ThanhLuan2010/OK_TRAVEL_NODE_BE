const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    icon: Joi.string(),
    url: Joi.string(),
    images: Joi.array().items(Joi.string()),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    icon: Joi.string(),
    url: Joi.string(),
    images: Joi.array().items(Joi.string()),
    is_hidden: Joi.boolean().default(false),
    is_delete: Joi.boolean().default(false),
  }),
};

const detailBlogCategory = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  }),
};

const listAdminCategory = {
  query: Joi.object().keys({
    is_delete: Joi.boolean().default(false),
    is_hidden: Joi.boolean().default(false),
    // order_by: Joi.string().valid('created_at:asc', 'created_at:desc', 'last_modified_date:asc', 'last_modified_date:desc'),
  }),
};

const listBlog = {
  query: Joi.object().keys({
    blog_category_id: Joi.string().uuid().required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
  }),
};

const createBlog = {
  body: Joi.object().keys({
    blog_category_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    content: Joi.string().required(),
    url: Joi.string(),
  }),
};

const updateBlog = {
  params: Joi.object().keys({
    id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  }),
  body: Joi.object().keys({
    blog_category_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    content: Joi.string().required(),
    url: Joi.string(),
    is_hidden: Joi.boolean().default(false),
    is_delete: Joi.boolean().default(false),
  }),
};

const listAdminBlog = {
  query: Joi.object().keys({
    blog_category_id: Joi.string().uuid().required(),
    is_delete: Joi.boolean().default(false),
    is_hidden: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
  }),
};

module.exports = {
  createCategory,
  listAdminCategory,
  detailBlogCategory,
  updateCategory,
  listBlog,
  createBlog,
  updateBlog,
  listAdminBlog,
};
