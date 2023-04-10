const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const imageRoutes = require("./image.route");

let rootRouter = router;

rootRouter.use("/user", userRoutes);
rootRouter.use("/image", imageRoutes);

module.exports = rootRouter;
