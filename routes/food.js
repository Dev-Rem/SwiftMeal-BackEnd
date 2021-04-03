const express = require("express");
const Section = require("../models/section");
const Food = require("../models/food");
const { auth, grantAccess } = require("./authController");
const { foodCreateValidation, foodUpdateValidation } = require("../validation");
const router = express.Router();

/* POST create new food document */
router.post(
  "/:sectionId/create",
  auth,
  grantAccess("createAny", "food"),
  async (req, res) => {
    // Validate request data
    const { error } = foodCreateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //   create new food document
    await Food.create(
      {
        sectionId: req.params.sectionId,
        name: req.body.name,
        price: req.body.price,
        picture: req.body.picture,
        description: req.body.description,
      },
      (error, food) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(food);
      }
    );
  }
);

/* GET get all the foods in a section */
router.get("/:sectionId", async (req, res) => {
  await Food.find({ sectionId: req.params.sectionId }, (error, foods) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(foods);
  });
});

/* GET get a single food document */
router.get("/:foodId", async (req, res) => {
  await Food.findById(req.params.foodId, (error, food) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(food);
  });
});

/* PUT update a single food document */
router.put(
  "/:foodId",
  auth,
  grantAccess("updateAny", "food"),
  async (req, res) => {
    // Validate request data
    const { error } = foodUpdateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //   find document by id and update
    await Food.findByIdAndUpdate(
      req.params.foodId,
      req.body,
      { new: true },
      (error, food) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(food);
      }
    );
  }
);

// DELETE delete a single food document
router.delete("/:foodId", auth.grantAccess("deleteAny", "food"), (req, res) => {
  Food.findByIdAndRemove(req.params.foodId, (error) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json({ status: "Success" });
  });
});
