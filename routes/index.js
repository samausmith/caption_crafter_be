const router = require("express").Router();
const userRouters = require("./users");
const captionedImageRouters = require("./captionedImages");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { loginUser, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateLoginUser,
  validateCreateUser,
} = require("../middlewares/validation");

router.use("/users", auth, userRouters);
router.use("/captions", captionedImageRouters);
router.post("/signin", validateLoginUser, loginUser);
router.post("/signup", validateCreateUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
