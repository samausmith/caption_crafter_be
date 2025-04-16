const captionedImageRouter = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCaptionedImages,
  getCaptionedImage,
  createCaptionedImage,
  deleteCaptionedImage,
  likeCaption,
  dislikeCaption,
} = require("../controllers/captionedImages");

const {
  validateCreateCaptionedImage,
  validateGetCaptionedImage,
} = require("../middlewares/validation");

captionedImageRouter.get("/", getCaptionedImages);

captionedImageRouter.get(
  "/:itemId",
  validateGetCaptionedImage,
  getCaptionedImage
);

captionedImageRouter.post("/", createCaptionedImage);

captionedImageRouter.delete(
  "/:itemId",
  auth,
  validateGetCaptionedImage,
  deleteCaptionedImage
);

captionedImageRouter.put(
  "/:itemId/likes",
  auth,
  validateGetCaptionedImage,
  likeCaption
);

captionedImageRouter.delete(
  "/:itemId/likes",
  auth,
  validateGetCaptionedImage,
  dislikeCaption
);

module.exports = captionedImageRouter;
