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
  "/:captionId",
  validateGetCaptionedImage,
  getCaptionedImage
);

captionedImageRouter.post(
  "/",
  auth,
  validateCreateCaptionedImage,
  createCaptionedImage
);

captionedImageRouter.delete(
  "/:captionId",
  auth,
  validateGetCaptionedImage,
  deleteCaptionedImage
);

captionedImageRouter.put(
  "/:captionId/likes",
  auth,
  validateGetCaptionedImage,
  likeCaption
);

captionedImageRouter.delete(
  "/:captionId/likes",
  auth,
  validateGetCaptionedImage,
  dislikeCaption
);

module.exports = captionedImageRouter;
