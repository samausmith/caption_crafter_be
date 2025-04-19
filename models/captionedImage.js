const mongoose = require("mongoose");
const validator = require("validator");

const captionedImageSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
    minlength: 2,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("captionedimages", captionedImageSchema);
