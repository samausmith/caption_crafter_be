const captionedImage = require("../models/captionedImage");

const { BadRequestError } = require("../utils/errors/BadRequestError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const getCaptionedImages = (req, res, next) => {
  captionedImage
    .find({})
    .then((captions) => res.status(200).send(captions))
    .catch(next);
};

const getCaptionedImage = (req, res, next) => {
  const { itemId } = req.params;
  captionedImage
    .findById(itemId)
    .orFail(() => new NotFoundError("Captioned image not found"))
    .then((caption) => res.status(200).send(caption))
    .catch(next);
};

const createCaptionedImage = (req, res, next) => {
  const { caption, imageUrl } = req.body;
  const owner = req.user;

  captionedImage
    .create({ caption, imageUrl, owner })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid data for creating a captioned image")
        );
      }
      return next(err);
    });
};

const deleteCaptionedImage = (req, res, next) => {
  const { captionId } = req.params;

  captionedImage
    .findById(captionId)
    .orFail(() => new NotFoundError("Captioned image not found"))
    .then((caption) => {
      if (caption.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError(
            "You do not have permission to delete this captioned image"
          )
        );
      }
      return captionedImage.findByIdAndDelete(captionId);
    })
    .then(() => res.send({ message: "successfully deleted captioned image" }))
    .catch(next);
};

const likeCaption = (req, res, next) => {
  captionedImage
    .findByIdAndUpdate(
      req.params.captionId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
    .orFail(() => new NotFoundError("Captioned image not found"))
    .then((caption) => res.send(caption))
    .catch(next);
};

const dislikeCaption = (req, res, next) => {
  captionedImage
    .findByIdAndUpdate(
      req.params.captionId,
      { $pull: { likes: req.user._id } }, // remove _id from the array
      { new: true }
    )
    .orFail(() => new NotFoundError("Captioned image not found"))
    .then((caption) => res.send(caption))
    .catch(next);
};

module.exports = {
  getCaptionedImages,
  getCaptionedImage,
  createCaptionedImage,
  deleteCaptionedImage,
  likeCaption,
  dislikeCaption,
};
