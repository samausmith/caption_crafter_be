const userRouter = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { validateUpdateUserProfile } = require("../middlewares/validation");

userRouter.get("/me", getCurrentUser);
userRouter.patch("/me", validateUpdateUserProfile, updateUserProfile);

module.exports = userRouter;
