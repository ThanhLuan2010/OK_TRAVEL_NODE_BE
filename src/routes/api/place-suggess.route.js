const express = require("express");
const validate = require("../../middlewares/validate");
const { suggessPlaceController } = require("../../controllers");
const { suggessPlaceValidation } = require("../../validations");

const router = express.Router();

router.get("/list-suggess", suggessPlaceController.listSuggessPlace);
router.post(
  "/add-suggess-place",
  validate(suggessPlaceValidation.addSuggessPlace),
  suggessPlaceController.addSuggessPlace
);

module.exports = router;
