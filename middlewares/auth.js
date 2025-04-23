const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header missing or malformed");
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token payload:", payload);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return next(new UnauthorizedError("Invalid or expired token"));
  }

  req.user = payload;

  return next(); // passing the request further along
};
