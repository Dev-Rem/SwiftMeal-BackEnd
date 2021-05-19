require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const Food = require("../models/food");
const { auth, grantAccess } = require("./authController");
const { foodValidation } = require("../validation");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");

// multer middleware for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* POST create new food document */
router.post(
  "/:sectionId/create",
  upload.single("file"),
  auth,
  grantAccess("createAny", "food"),
  async (req, res) => {
    // Validate request data
    const { error } = foodValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const file = req.file;

    let s3bucket = new AWS.S3({
      accesKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3bucket.upload(params, (error, data) => {
      if (error) return res.status(400).json({ error: error });
      console.log(data);
      //   create new food document
      Food.create(
        {
          sectionId: req.params.sectionId,
          name: req.body.name,
          price: req.body.price,
          picture: {
            url: data.Location,
            s3_key: params.Key,
          },
          description: req.body.description,
        },
        (error, food) => {
          if (error) return res.status(400).json({ error: error });
          res.status(200).json(food);
        }
      );
    });
  }
);

/* GET get all the foods in a section */
router.get("/:sectionId/foods", async (req, res) => {
  await Food.find({ sectionId: req.params.sectionId }, (error, foods) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(foods);
  });
});

/* GET get a single food document */
router.get("/:foodId", (req, res) => {
  Food.findById(req.params.foodId, (error, food) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(food);
  });
});

/* PUT update a single food document */
router.put(
  "/:foodId/edit",
  auth,
  grantAccess("updateAny", "food"),
  (req, res) => {
    // console.log(req);
    console.log(req.file);
    console.log(req.body);
    // Validate request data
    // const { error } = foodValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const file = fs.readFileSync(req.file.path);
    const file_encode = file.toString("base64");

    //   find document by id and update
    Food.findByIdAndUpdate(
      req.params.foodId,
      {
        name: req.body.name,
        price: req.body.price,
        picture: {
          data: new Buffer.alloc(10, file_encode, "base64"),
          contentType: req.file.mimetype,
        },
        description: req.body.description,
      },
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
