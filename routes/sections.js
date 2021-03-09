const express = require("express");
const Menu = require("../models/menu");
const Section = require("../models/section");
const { auth, grantAccess } = require("./authController");
const { sectionValidation } = require("../validation");
const router = express.Router();

/* Create new section */

router.get("/create");
