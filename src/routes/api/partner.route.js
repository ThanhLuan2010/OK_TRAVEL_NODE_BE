const express = require("express");
const validate = require("../../middlewares/validate");
const { authJwt } = require("../../middlewares/jwtAuth");
const { ALL_ROLE } = require("../../constant/roles.constant");
const { partnerController } = require("../../controllers");
const { partnerValidate } = require("../../validations");

const router = express.Router();

router.get("/list", partnerController.listPartner);

router.post(
  "/create",
  authJwt([ALL_ROLE.ADMIN]),
  validate(partnerValidate.createPartner),
  partnerController.createPartner
);

router.post(
  "/update/:id",
  authJwt([ALL_ROLE.ADMIN]),
  validate(partnerValidate.updatePartner),
  partnerController.updatePartner
);

router.post(
  "/delete/:id",
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(partnerValidate.deletePartner),
  partnerController.DeletePartner
);

module.exports = router;
