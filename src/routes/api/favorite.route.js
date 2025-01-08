const express = require('express');
const validate = require('../../middlewares/validate');
const favoriteValidation = require('../../validations/favorite.validation');
const favoriteController = require('../../controllers/favorite.controller');
const { authJwt } = require('../../middlewares/jwtAuth');

const router = express.Router();

router.get('/list', authJwt(), favoriteController.list);
router.post('/action', authJwt(), validate(favoriteValidation.action), favoriteController.action);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: FavoriteService
 *   description: FavoriteService management
 */

/**
 * @swagger
 * /favorite/list:
 *   get:
 *     summary: list favorite Service
 *     description: list favorite Service.
 *     tags: [FavoriteService]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /favorite/action:
 *   post:
 *     summary: favorite action
 *     description: favorite action or unFavorite action if exists.
 *     tags: [FavoriteService]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "travel_place"
 *               ref_id:
 *                 type: uuid
 *                 example: "4868a62d-724c-41d8-9172-ad07779bee70"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
