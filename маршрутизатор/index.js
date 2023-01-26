const Router = require("express");
const router = new Router();

const flowersRouter = require("./flowersRouter");
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/flowers", flowersRouter);

module.exports = router;
