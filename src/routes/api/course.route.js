const express = require("express");
const validate = require("../../middlewares/validate");
const { authJwt } = require("../../middlewares/jwtAuth");
const { ALL_ROLE } = require("../../constant/roles.constant");
const { CourseController } = require("../../controllers");
const { courseValidation } = require("../../validations");

const router = express.Router();

router.get("/list", CourseController.listCourse);

router.post(
  "/create",
  authJwt([ALL_ROLE.ADMIN]),
  validate(courseValidation.createCourse),
  CourseController.createCourse
);

router.post(
  "/update/:id",
  authJwt([ALL_ROLE.ADMIN]),
  validate(courseValidation.updateCourse),
  CourseController.updateCourse
);

router.post(
  "/delete/:id",
  authJwt([ALL_ROLE.ADMIN, ALL_ROLE.STAFF]),
  validate(courseValidation.deleteCourse),
  CourseController.DeleteCourse
);

module.exports = router;
