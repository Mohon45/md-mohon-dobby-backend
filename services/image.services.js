const Image = require("../models/Image");

exports.uploadNewImageService = async (data) => {
  const result = await Image.create(data);
  return result;
};

exports.getAllImagesService = async () => {
  const result = await Image.find({});
  return result;
};
