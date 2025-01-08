const express = require('express');
const testController = require('../../controllers/test.controller');
const { ALL_ROLE } = require('../../constant/roles.constant');
const { authJwt } = require('../../middlewares/jwtAuth');

const router = express.Router();

router.get('/my-info', authJwt(), testController.myInfo);

module.exports = router;
