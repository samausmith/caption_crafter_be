const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const error = new Error("Incorrect email or password");
error.name = "AuthorizationError";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  console.log("Find User Email:", email);
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("Not Found User Email:", email);
        return Promise.reject(error);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log(
            "Passwords do not match",
            "pass1:",
            password,
            "userpass:",
            user.password
          );
          return Promise.reject(error);
        }
        console.log("passwords match lulz");
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
