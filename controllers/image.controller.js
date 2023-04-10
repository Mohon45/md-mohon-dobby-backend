const {
  uploadNewImageService,
  getAllImagesService,
} = require("../services/image.services");
const { httpResponse } = require("../utils/httpResponse");
const { uploadImage } = require("../utils/cloudinary");

exports.uploadNewImage = async (req, res) => {
  try {
    let newUser = {};

    if (req.files[0]) {
      const imgUrl = await uploadImage(req.files[0].path);
      const image = imgUrl.secure_url;
      newUser = { ...req.body, image };
    }
    const result = await uploadNewImageService(newUser);

    res
      .status(201)
      .json(httpResponse("success", result, "Image Upload successfull"));
  } catch (error) {
    res.status(500).json(httpResponse("fail", {}, error.message));
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const result = await getAllImagesService();

    res
      .status(200)
      .json(httpResponse("success", result, "data retrieval successfull"));
  } catch (error) {
    res.status(500).json(httpResponse("fail", {}, error.message));
  }
};
