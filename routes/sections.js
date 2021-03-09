const express = require("express");
const Menu = require("../models/menu");
const Section = require("../models/section");
const { auth, grantAccess } = require("./authController");
const { sectionValidation } = require("../validation");
const router = express.Router();

/* Create new section */

router.post(
  "/:menuId:create",
  auth,
  grantAccess("createAny", "section"),
  (req, res) => {
    // Validate request data
    const { error } = sectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Section.create(
      {
        name: req.body.name,
        menuId: req.params.menuId,
      },
      (error, section) => {
        if (error) return res.status(400).json({ error: error });
        res.send(section);
      }
    );
  }
);

module.exports = router;
