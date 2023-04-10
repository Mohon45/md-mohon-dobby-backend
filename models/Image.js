const mongoose = require("mongoose");
const validator = require("validator");

// schema design
const imageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this image."],
      trim: true,
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 characters."],
      maxLenght: [100, "Name is too large"],
    },
    image: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
      required: [true, "Please provide a image url."],
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
