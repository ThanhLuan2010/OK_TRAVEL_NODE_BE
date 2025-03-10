const express = require("express");
const validate = require("../../middlewares/validate");
const blogValidation = require("../../validations/blog.validation");
const { authJwt } = require("../../middlewares/jwtAuth");
const { ALL_ROLE } = require("../../constant/roles.constant");
const { faqController } = require("../../controllers");
const { FaqValidation } = require("../../validations");

const router = express.Router();

router.get("/list", faqController.listFAQ);

router.post(
  "/create",
  authJwt([ALL_ROLE.ADMIN]),
  validate(FaqValidation.createFaq),
  faqController.createFaq
);

router.post(
  "/update/:id",
  authJwt([ALL_ROLE.ADMIN]),
  validate(FaqValidation.updateFaq),
  faqController.updateFaq
);

router.post(
  "/delete/:id",
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(FaqValidation.deleteFaq),
  faqController.DeleteFaq
);

module.exports = router;
