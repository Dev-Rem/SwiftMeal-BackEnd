const express = require("express");
const Account = require("../models/account.js");
const Address = require("../models/address.js");
const Cart = require("../models/cart");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { registerValidation, loginValidation } = require("../validation");

/* Create a new user account */
router.post("/signup", async (req, res) => {
  // validate user account info
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if user already exists
  const userExist = await Account.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("Email already exists");

  // create new user account and return account
  Account.create(req.body, (error, account) => {
    if (error) res.status(400).send(error);
    Cart.create({ userId: account._id }, (error) => {
      if (error) res.status(400).send(error);
      res.status(200).json(account);
    });
  });
});

/* Login a user */
router.post("/signin", async (req, res) => {
  // validate user login info
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if account exists
  const account = await Account.findOne({ email: req.body.email });
  if (!account) return res.status(404).send("User email not found!");

  // compare request password with hashed database password
  await account.comparePassword(req.body.password, (error, isMatch) => {
    if (error) return res.status(400).send({ error: error });
    if (!isMatch) return res.status(400).send("Wrong password");
  });

  // generate user token
  await account.generateToken((error, account) => {
    if (error) return res.status(400).send("Could not generate token");
    res.header("Authorization", account.token).status(200).json({
      token: account.token,
    });
  });
});

/* Logout a user */
router.post(
  "/signout",
  // grantAccess("updateOwn", "profile"),
  auth,
  async (req, res) => {
    // get user token from request headers
    const token = req.header("Authorization");

    // find user account and delete token
    Account.findOneAndUpdate({ token: token }, { token: "" }, (error) => {
      if (error) return res.status(400).json({ error: error });
      return res.status(200).send("Logged out");
    });
  }
);

/* Get a single user account */
router.get(
  "/user",
  auth,
  grantAccess("readOwn", "profile"),
  async (req, res) => {
    // get user token from request headers
    const token = req.header("Authorization");

    // find account using token and return user infomation
    const account = await Account.findOne({ token: token });
    if (!account)
      return res.status(400).json({ error: "Invalid token or user not found" });

    // return user account information
    res.status(200).json({
      id: account._id,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      email: account.email,
      role: account.role,
      addressId: account.addressId,
    });
  }
);

/* Get a single user account */
router.put(
  "/user",
  auth,
  grantAccess("updateOwn", "profile"),
  async (req, res) => {
    // get user token from request headers
    const token = req.header("Authorization");

    // find account using token and return user infomation
    const account = await Account.findOneAndUpdate({ token: token }, req.body);
    if (!account)
      return res.status(400).json({ error: "Invalid token or user not found" });

    // return user account information
    res.status(200).json({
      id: account._id,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      email: account.email,
      role: account.role,
      addressId: account.addressId,
    });
  }
);

module.exports = router;
