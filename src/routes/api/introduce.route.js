const express = require("express");
const validate = require("../../middlewares/validate");
const { authJwt } = require("../../middlewares/jwtAuth");
const { ALL_ROLE } = require("../../constant/roles.constant");
const { introduceController } = require("../../controllers");
const { introduceValidate } = require("../../validations");

const router = express.Router();

router.get("/get-introduce-info", validate(introduceValidate.getIntroduce), introduceController.getIntroduce);

router.post(
  "/create",
  authJwt([ALL_ROLE.ADMIN]),
  validate(introduceValidate.createIntoduce),
  introduceController.createIntroduce
);

router.post(
  "/update/:id",
  authJwt([ALL_ROLE.ADMIN]),
  validate(introduceValidate.updateIntoduce),
  introduceController.updateIntroduce
);

router.post(
  "/delete/:id",
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(introduceValidate.deleteIntoduce),
  introduceController.DeleteIntroduce
);

module.exports = router;
