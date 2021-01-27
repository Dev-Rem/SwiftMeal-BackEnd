const jwt = require("jsonwebtoken");

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
