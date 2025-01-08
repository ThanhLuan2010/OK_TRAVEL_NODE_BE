const express = require('express');
const validate = require('../../middlewares/validate');
const interestedValidation = require('../../validations/interested.validation');
const interestedController = require('../../controllers/interested.controller');
const { authJwt } = require('../../middlewares/jwtAuth');
const { ALL_ROLE } = require('../../constant/roles.constant');

const router = express.Router();

router.get('/list', authJwt(), interestedController.list);
router.post('/action', authJwt(), validate(interestedValidation.action), interestedController.action);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: InterestedService
 *   description: InterestedService management
 */

/**
 * @swagger
 * /interested/list:
 *   get:
 *     summary: list Interested Service
 *     description: list Interested Service.
 *     tags: [InterestedService]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /interested/action:
 *   post:
 *     summary: interested action
 *     description: interested action or uninterested action if exists.
 *     tags: [InterestedService]
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
