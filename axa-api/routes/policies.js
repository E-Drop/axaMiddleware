var express = require("express");
const PoliciesController = require("../controllers/PoliciesController");

var router = express.Router();

router.get("/", PoliciesController.policiesList);
router.get("/:id", PoliciesController.policiesGet);

module.exports = router;