const jwt = require("jsonwebtoken");
const { roles } = require("../role");

module.exports = function (req, res, next) {
  //  get user auth token
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).send("Access denied or token was not provided");

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    if (error) return res.status(400).send("Invalid token");
  }
};

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
