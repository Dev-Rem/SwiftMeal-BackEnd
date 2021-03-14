const express = require("express");
const Menu = require("../models/menu");
const Section = require("../models/section");
const { auth, grantAccess } = require("./authController");
const { sectionValidation } = require("../validation");
const router = express.Router();

/* Create new section */

router.post(
  "/:menuId/create",
  auth,
  grantAccess("createAny", "section"),
  (req, res) => {
    // Validate request data
    const { error } = sectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Section.create(req.body, async (error, section) => {
      if (error) return res.status(400).json({ error: error });
      await Menu.findByIdAndUpdate(req.params.menuId, {
        $push: { scetions: section._id },
      });
      res.send(section);
    });
  }
);

/* Get all menu sections */

router.get("/:menuId", auth, grantAccess("readAny", "section"), (req, res) => {
  Section.find({}, (error, scetions) => {
    if (error) return res.status(400).json({ error: error });
    res.send(sections);
  });
});

/* Get a single menu section */
// router.get();

module.exports = router;
