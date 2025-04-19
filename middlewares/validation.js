const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

const validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

const validateCreateCaptionedImage = celebrate({
  body: Joi.object().keys({
    caption: Joi.string().required().min(2).messages({
      "string.min": 'The minimum length of the "caption" field is 2',
      "string.empty": 'The "caption" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string()
      .required()
      .custom(validateEmail)
      .min(2)
      .max(30)
      .messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
        "string.email": 'The "name" field must be a valid email',
      }),
    password: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "password" field is 2',
      "string.max": 'The maximum length of the "password" field is 30',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom(validateEmail)
      .min(2)
      .max(30)
      .messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
        "string.email": 'The "name" field must be a valid email',
      }),
    password: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "password" field is 2',
      "string.max": 'The maximum length of the "password" field is 30',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateGetCaptionedImage = celebrate({
  params: Joi.object().keys({
    captionId: Joi.string().required(),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateCaptionedImage,
  validateCreateUser,
  validateGetCaptionedImage,
  validateGetUser,
  validateLoginUser,
  validateUpdateUserProfile,
};
