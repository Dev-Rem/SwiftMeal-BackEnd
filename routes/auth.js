const express = require("express");
const Account = require("../models/account.js");
const router = express.Router();
const auth = require("./authController");
const { registerValidation, loginValidation } = require("../validation");

/* Create a new user account */
router.post("/register", async (req, res) => {
  // validate user account info
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if user already exists
  const userExist = await Account.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("Email already exists");

  // create new user account
  const account = new Account(req.body);
  await account.save((error, account) => {
    if (error) res.status(400).send(error);
    res.send(account);
  });
});

/* Login a user */
router.post("/login", async (req, res) => {
  // validate user login info
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if account exists
  const account = await Account.findOne({ email: req.body.email });
  if (!account) return res.status(404).send("User email not found!");

  // compare request password with hashed database password
  await account.comparePassword(req.body.password, (isMatch) => {
    if (!isMatch) return res.status(400).send("Wrong password");
  });

  // generate user token
  await account.generateToken((error, account) => {
    if (error) return res.status(400).send("Could not generate token");
    res.header("auth-token", account.token).status(200).json({
      token: account.token,
    });
  });
});

/* Logout a user */
router.post("/logout", auth, (req, res) => {
  Account.findByIdAndDelete({ _id: req.user_id }, { token: "" }, (error) => {
    if (error) return res.json({ success: false, error });
    return res
      .status(200)
      .send({ success: true, message: "Successfully Logged Out" });
  });
});

/* Get a single user account */
router.get("/user", auth, async (req, res) => {
  const account = await Account.findOne({ _id: req.user });
  if (!account) return res.status(400).send("Account not found");
  return res.status(200).send(account);
});

module.exports = router;
