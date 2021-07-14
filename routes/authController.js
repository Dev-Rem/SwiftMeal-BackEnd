const jwt = require("jsonwebtoken");
const { roles } = require("../role");

exports.auth = function (req, res, next) {
  console.log(req.user);
  //  get user auth token
  const token = req.header("Authorization");
  if (!token)
    return res.status(400).send("Access denied or token was not provided");

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
        return res.status(400).json({
          error: "Permission denied",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
