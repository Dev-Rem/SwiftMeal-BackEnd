const express = require("express");
const Account = require("../models/account.js");
const Address = require("../models/address.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { roles } = require("../role");
const {
  registerValidation,
  loginValidation,
  addressValidation,
} = require("../validation");

/* Create a new user account */
router.post("/register", async (req, res) => {
  // validate user account info
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if user already exists
  const userExist = await Account.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("Email already exists");

  // create new user account and return account
  const account = new Account(req.body);
  account.save((error, account) => {
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
  await account.comparePassword(req.body.password, (error, isMatch) => {
    if (error) return res.status(400).send({ error: error });
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
router.post(
  "/logout",
  grantAccess("updateOwn", "profile"),
  auth,
  async (req, res) => {
    // get user token from request headers
    const token = req.header("auth-token");

    // find user account and delete token
    Account.findOne({ token: token }, (error, account) => {
      if (error) return res.status(400).json({ error: error });
      account.token = undefined;
      account.save();
      res.status(200).send("Logged out");
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
    const token = req.header("auth-token");

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

/* POST create new user address document */
router.post(
  "/address/create",
  grantAccess("createOwn", "address"),
  auth,
  async (req, res) => {
    // validate address info
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new user address
    const address = new Address(req.body);
    await address.save((error, address) => {
      if (error) return res.status(400).send("Unable to save address");

      // find authenticated user document
      Account.findByIdAndUpdate(
        { _id: req.user._id },
        { addressId: address._id },
        (error, account) => {
          if (error) return res.status(400).json({ error: error });
          account.save();
        }
      );

      res.status(200).send(address);
    });
  }
);

module.exports = router;
