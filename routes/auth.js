const express = require("express");
const Account = require("../models/account.js");
const Address = require("../models/address.js");
const Cart = require("../models/cart");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { registerValidation, loginValidation } = require("../validation");
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User account information to register
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             example:
 *               firstName: "Aremu"
 *               lastName: "Oluwaseyi Festus"
 *               email: "user@email.com"
 *               phoneNumber: "+2349061540777"
 *               password: "Common1407"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   description: User's role
 *                 _id:
 *                   type: string
 *                   description: User's ID
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 phoneNumber:
 *                   type: string
 *                   description: User's phone number
 *                 password:
 *                   type: string
 *                   format: password
 *                   description: Encrypted password
 *                 nationalFormat:
 *                   type: string
 *                   description: Phone number in national format
 *                 internationalFormat:
 *                   type: string
 *                   description: Phone number in international format
 *                 countryCode:
 *                   type: string
 *                   description: Country code
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Last update date
 *                 __v:
 *                   type: integer
 *                   description: Version key
 *             example:
 *               role: "user"
 *               _id: "6661af9fd7c00c8694ea7f6a"
 *               firstName: "Aremu"
 *               lastName: "Oluwaseyi Festus"
 *               email: "user@email.com"
 *               phoneNumber: "+2349061540777"
 *               password: "$2b$10$79VGFl.JLemJSYfh/Y7iCe.GYdmJ1c34jAdX.ALowrh/up.98IW0S"
 *               nationalFormat: "0906 154 0777"
 *               internationalFormat: "+234 906 154 0777"
 *               countryCode: "NG"
 *               createdAt: "2024-06-06T12:46:23.826Z"
 *               updatedAt: "2024-06-06T12:46:23.826Z"
 *               __v: 0
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Email already exists"
 */
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
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       description: User login information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             example:
 *               email: "user@email.com"
 *               password: "Common1407"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjYxYWY5ZmQ3YzAwYzg2OTRlYTdmNmEiLCJlbWFpbCI6InVzZXJAZW1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTc2NzgyMzEsImV4cCI6MTcxNzc2NDYzMX0.xtlzNq6Z1-CkVM4nBkz6cTXqaqQhfDJ9HnIe2EBDOjA"
 *       400:
 *         description: Bad Request
 */

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
/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Logged out"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Error message"
 */
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

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get a single user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user account information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                 phoneNumber:
 *                   type: string
 *                   description: User's phone number
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 role:
 *                   type: string
 *                   description: User's role
 *                 addressId:
 *                   type: string
 *                   description: User's address ID
 *             example:
 *               id: "6661af9fd7c00c8694ea7f6a"
 *               firstName: "Aremu"
 *               lastName: "Oluwaseyi Festus"
 *               phoneNumber: "+2349061540777"
 *               email: "user@email.com"
 *               role: "user"
 *               addressId: "someAddressId"
 *       400:
 *         description: Invalid token or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid token or user not found"
 */

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
/**
 * @swagger
 * /api/auth/user:
 *   put:
 *     summary: Update a single user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               email:
 *                 type: string
 *                 description: User's email
 *               addressId:
 *                 type: string
 *                 description: User's address ID
 *             example:
 *               firstName: "Aremu"
 *               lastName: "Oluwaseyi Festus"
 *               phoneNumber: "+2349061540777"
 *               email: "user@email.com"
 *               addressId: "someAddressId"
 *     responses:
 *       200:
 *         description: Successfully updated user account information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                 phoneNumber:
 *                   type: string
 *                   description: User's phone number
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 role:
 *                   type: string
 *                   description: User's role
 *                 addressId:
 *                   type: string
 *                   description: User's address ID
 *             example:
 *               id: "6661af9fd7c00c8694ea7f6a"
 *               firstName: "Aremu"
 *               lastName: "Oluwaseyi Festus"
 *               phoneNumber: "+2349061540777"
 *               email: "user@email.com"
 *               role: "user"
 *               addressId: "someAddressId"
 *       400:
 *         description: Invalid token or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid token or user not found"
 */
/* Update a single user account */
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
