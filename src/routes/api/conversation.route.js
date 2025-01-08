const express = require('express');
const validate = require('../../middlewares/validate');
const { conversationValidation } = require('../../validations/index');
const { conversationController } = require('../../controllers/index');
const { authJwt } = require('../../middlewares/jwtAuth');

const router = express.Router();

router.get('/list', authJwt(), validate(conversationValidation.list), conversationController.list);
router.post(
  '/new-conversation',
  authJwt(),
  validate(conversationValidation.newConversation),
  conversationController.newConversation
);

router.get('/messages/list', authJwt(), validate(conversationValidation.listMessages), conversationController.listMessages);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation management
 */

/**
 * @swagger
 * /conversation/list:
 *   get:
 *     summary: list Conversation
 *     description: list Conversation.
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           example: 20
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /conversation/new-conversation:
 *   post:
 *     summary: find one or create new conversation
 *     description: find one or create new conversation.
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: email
 *                 example: "test@gmail.com"
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
