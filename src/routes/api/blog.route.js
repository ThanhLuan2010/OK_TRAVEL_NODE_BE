const express = require('express');
const validate = require('../../middlewares/validate');
const blogValidation = require('../../validations/blog.validation');
const blogController = require('../../controllers/blog.controller');
const { authJwt } = require('../../middlewares/jwtAuth');
const { ALL_ROLE } = require('../../constant/roles.constant');

const router = express.Router();

// Blog category
router.get('/category/list', blogController.listCategory);
router.get('/category/detail/:id', validate(blogValidation.detailBlogCategory), blogController.detailBlogCategory);

// Blog category (admin)
router.get(
  '/category/list-admin',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.listAdminCategory),
  blogController.listAdminCategory
);
router.get(
  '/category/detail-admin/:id',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.detailBlogCategory),
  blogController.detailAdminBlogCategory
);

router.post(
  '/category/create',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.createCategory),
  blogController.createBlogCategory
);
router.post(
  '/category/update/:id',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.updateCategory),
  blogController.updateBlogCategory
);

// blog
router.get('/list', validate(blogValidation.listBlog), blogController.listBlog);
router.get('/detail/:id', validate(blogValidation.detailBlogCategory), blogController.detailBlog);

// blog (admin)
router.get(
  '/list-admin',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.listAdminBlog),
  blogController.listAdminBlog
);
router.get(
  '/detail-admin/:id',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.detailBlogCategory),
  blogController.detailAdminBlog
);
router.post(
  '/create',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.createBlog),
  blogController.createBlog
);
router.post(
  '/update/:id',
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(blogValidation.updateBlog),
  blogController.updateBlog
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: BlogCategory
 *   description: BlogCategory management
 */

/**
 * @swagger
 * /blog/category/list:
 *   get:
 *     summary: list blog category
 *     description: list blog category.
 *     tags: [BlogCategory]
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/category/detail/{id}:
 *   get:
 *     summary: detail blog category
 *     description: detail blog category.
 *     tags: [BlogCategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/category/list-admin:
 *   get:
 *     summary: list blog category
 *     description: list blog category.
 *     tags: [BlogCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: is_hidden
 *         in: query
 *         description: is_hidden
 *         schema:
 *           type: boolean
 *           example: false
 *       - name: is_delete
 *         in: query
 *         description: is_delete
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/category/detail-admin/{id}:
 *   get:
 *     summary: detail blog category
 *     description: detail blog category.
 *     tags: [BlogCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/category/create:
 *   post:
 *     summary: create new blog category
 *     description: create new blog category.
 *     tags: [BlogCategory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["url1", "url2", "url3"]
 *               title:
 *                 type: string
 *                 example: "title"
 *               description:
 *                 type: string
 *                 example: "description"
 *               icon:
 *                 type: string
 *                 example: "icon"
 *               url:
 *                 type: string
 *                 example: "url"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /blog/category/update/{id}:
 *   post:
 *     summary: update blog category
 *     description: update blog category.
 *     tags: [BlogCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["url1", "url2", "url3"]
 *               title:
 *                 type: string
 *                 example: "title"
 *               description:
 *                 type: string
 *                 example: "description"
 *               icon:
 *                 type: string
 *                 example: "icon"
 *               url:
 *                 type: string
 *                 example: "url"
 *               is_delete:
 *                 type: boolean
 *                 example: "false"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

// ================================================================================

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /blog/list:
 *   get:
 *     summary: list blog
 *     description: list blog.
 *     tags: [Blog]
 *     parameters:
 *       - name: blog_category_id
 *         in: query
 *         required: true
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "4868a62d-724c-41d8-9172-ad07779bee70"
 *       - name: page
 *         in: query
 *         description: page
 *         schema:
 *           type: number
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/detail/{id}:
 *   get:
 *     summary: detail blog
 *     description: detail blog.
 *     tags: [Blog]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/list-admin:
 *   get:
 *     summary: list blog
 *     description: list blog.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: blog_category_id
 *         in: query
 *         required: true
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "4868a62d-724c-41d8-9172-ad07779bee70"
 *       - name: page
 *         in: query
 *         description: page
 *         schema:
 *           type: number
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: limit
 *         schema:
 *           type: number
 *           example: 10
 *       - name: is_hidden
 *         in: query
 *         description: is_hidden
 *         schema:
 *           type: boolean
 *           example: false
 *       - name: is_delete
 *         in: query
 *         description: is_delete
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/detail-admin/{id}:
 *   get:
 *     summary: detail blog
 *     description: detail blog.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: create new blog
 *     description: create new blog.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_category_id:
 *                 type: uuid
 *                 example: "4868a62d-724c-41d8-9172-ad07779bee70"
 *               title:
 *                 type: string
 *                 example: "title"
 *               description:
 *                 type: string
 *                 example: "description"
 *               content:
 *                 type: string
 *                 example: "content"
 *               url:
 *                 type: string
 *                 example: "url"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /blog/update/{id}:
 *   post:
 *     summary: update blog
 *     description: update blog.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the blog category
 *         schema:
 *           type: string
 *           example: "b49349dd-7ddf-4b02-a659-1fb88021a4f9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_category_id:
 *                 type: uuid
 *                 example: "4868a62d-724c-41d8-9172-ad07779bee70"
 *               title:
 *                 type: string
 *                 example: "title"
 *               description:
 *                 type: string
 *                 example: "description"
 *               content:
 *                 type: string
 *                 example: "content"
 *               url:
 *                 type: string
 *                 example: "url"
 *               is_delete:
 *                 type: boolean
 *                 example: "false"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
