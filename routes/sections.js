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

    Section.create(
      {
        menuId: req.params.menuId,
        name: req.body.name,
        description: req.body.description,
      },
      (error, section) => {
        if (error) return res.status(400).json({ error: error });
        res.send(section);
      }
    );
  }
);

/* Get all menu sections */
router.get("/:menuId", (req, res) => {
  // Get all section documents based on the menu id
  Section.find({ menuId: req.params.menuId }, (error, sections) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(sections);
  });
});

/* Get a single menu section */
router.get("/:menuId/:sectionId", (req, res) => {
  Section.findById(req.params.sectionId, (error, section) => {
    if (error) return res.status(400).json({ error: error });
    if (section.menuId != req.params.menuId) {
      res.status(400).send("Requested section does not belong under this menu");
    }
    res.status(200).json(section);
  });
});

/* PUT update a section document */
router.put(
  "/:sectionId",
  auth,
  grantAccess("updateAny", "section"),
  (req, res) => {
    // Validate request data
    const { error } = sectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Section.findByIdAndUpdate(
      req.params.sectionId,
      req.body,
      { upsert: true, new: true },
      (error, section) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(section);
      }
    );
  }
);

/* DELETE  delete a section document */
router.delete(
  "/:sectionId",
  auth,
  grantAccess("deleteAny", "section"),
  (req, res) => {
    Section.findByIdAndRemove(req.params.sectionId, (error) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "Success" });
    });
  }
);

module.exports = router;
