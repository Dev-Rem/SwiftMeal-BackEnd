const express = require("express");
const fs = require("fs");
const path = require("path");
const Food = require("../models/food");
const { auth, grantAccess } = require("./authController");
const { foodValidation } = require("../validation");
const router = express.Router();
const multer = require("multer");

// multer middleware for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

/* POST create new food document */
router.post(
  "/:sectionId/create",
  upload.single("picture"),
  auth,
  grantAccess("createAny", "food"),
  async (req, res) => {
    // Validate request data
    const { error } = foodValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const file = fs.readFileSync(req.file.path);
    const file_encode = file.toString("base64");

    //   create new food document
    await Food.create(
      {
        sectionId: req.params.sectionId,
        name: req.body.name,
        price: req.body.price,
        picture: {
          data: new Buffer.alloc(10, file_encode, "base64"),
          contentType: req.file.mimetype,
        },
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
router.get("/:foodId", (req, res) => {
  const food = Food.findById(req.params.foodId);
  console.log(food);
  if (!food)
    return res.status(400).json({ error: "no food object in database" });
  res.status(200).json(food);
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
router.delete(
  "/:foodId",
  auth,
  grantAccess("deleteAny", "food"),
  (req, res) => {
    Food.findByIdAndRemove(req.params.foodId, (error) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "Success" });
    });
  }
);

module.exports = router;
