const express = require("express");
const Restaurant = require("../models/restaurant.js");
const { auth } = require("./authController");
const { menuValidation } = require("../validation");
const router = express.Router();

/* Create new restaurant menu */
router.post("/create", auth, async (req, res) => {
  // Check user permission
    
});
