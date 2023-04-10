const { Router } = require("express");
const router = Router();
const uploader = require("../middleware/uploader");

const imageController = require("../controllers/image.controller");

/* GET users listing. */
router.post("/upload", uploader.array("image"), imageController.uploadNewImage);
router.get("/", imageController.getAllImages);

module.exports = router;
