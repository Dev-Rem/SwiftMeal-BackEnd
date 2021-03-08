const express = require("express");
const Account = require("../models/account.js");
const Address = require("../models/address.js");
const router = express.Router();
const { auth } = require("./authController");
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
    if (error) return res.status(400).send(error);
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
router.post("/logout", auth, async (req, res) => {
  // get user token from request headers
  const token = req.header("auth-token");

  //  check user permission to login
  const permission = await roles.can(req.user.role).updateOwn("profile");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // find user account and delete token
  Account.findOne({ token: token }, (error, account) => {
    if (error) return res.status(400).json({ error: error });
    account.token = undefined;
    account.save();
    res.status(200).send("Logged out");
  });
});

/* Get a single user account */
router.get("/user", auth, async (req, res) => {
  // get user token from request headers
  const token = req.header("auth-token");

  //  check user permission to view profile
  const permission = await roles.can(req.user.role).readOwn("profile");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });

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
    address_id: account.address_id,
  });
});

/* POST create new user address document */
router.post("/address/create", auth, async (req, res) => {
  // validate address info
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  check user permission to create address
  const permission = await roles.can(req.user.role).createOwn("address");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // create new user address
  const address = new Address(req.body);
  await address.save((error, address) => {
    if (error) return res.status(400).send("Unable to save address");

    // find authenticated user document
    Account.findByIdAndUpdate(
      { _id: req.user._id },
      { address_id: address._id },
      (error, account) => {
        if (error) return res.status(400).json({ error: error });
        account.save();
      }
    );

    res.status(200).send(address);
  });
});

module.exports = router;
