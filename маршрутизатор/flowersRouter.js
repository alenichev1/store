const Router = require("express");
const router = new Router();
const flowersController = require("../controllers/flowersController");

router.post("/", flowersController.create);
router.get("/", flowersController.getAll);
router.get("/:id", flowersController.getOne);

module.exports = router;
