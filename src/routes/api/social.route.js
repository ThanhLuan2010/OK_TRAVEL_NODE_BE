const express = require("express");
const validate = require("../../middlewares/validate");
const { authJwt } = require("../../middlewares/jwtAuth");
const { ALL_ROLE } = require("../../constant/roles.constant");
const { socialController } = require("../../controllers");
const { socialValidate } = require("../../validations");

const router = express.Router();

router.get("/list", socialController.listSocal);

router.post(
  "/create",
  authJwt([ALL_ROLE.ADMIN]),
  validate(socialValidate.createSocial),
  socialController.createSocal
);

router.post(
  "/update/:id",
  authJwt([ALL_ROLE.ADMIN]),
  validate(socialValidate.updateSocial),
  socialController.updateSocal
);

router.post(
  "/delete/:id",
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(socialValidate.deleteSocial),
  socialController.DeleteSocal
);

module.exports = router;
