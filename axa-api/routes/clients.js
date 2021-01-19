var express = require("express");
const ClientsController = require("../controllers/ClientsController");

var router = express.Router();

router.get("/", ClientsController.clientsList);
router.get("/:id", ClientsController.clientsGet);
router.get("/:id/policies", ClientsController.clientsPolicy);

module.exports = router;