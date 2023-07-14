require("dotenv").config();
const express = require("express");
const MenuItem = require("../models/menuItem");
const { auth, grantAccess } = require("./authController");
const { menuItemValidation } = require("../validation");
const router = express.Router();

/* POST create new food document */
// the id provided should be the menu id
router.post(
  "/:id",
  auth,
  grantAccess("createAny", "menuItem"),
  async (req, res) => {
    // Validate request data
    const { error } = menuItemValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //   create new food document
    MenuItem.create(
      {
        menuId: req.params.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      },
      (error, menuItem) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(menuItem);
      }
    );
  }
);

/* GET get all the menu items in a menu */
// the id provided should be the menu id
router.get("/:id", async (req, res) => {
  await MenuItem.find({ menuId: req.params.id }, (error, menuItems) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menuItems);
  });
});

/* GET get a single menu item document */
// the id provided should be the menu item id
router.get("/:id/item", (req, res) => {
  MenuItem.findById(req.params.id, (error, menuItem) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menuItem);
  });
});

/* PUT update a single menu item document */
// the id provided should be the menu item id
router.put("/:id", auth, grantAccess("updateAny", "menuItem"), (req, res) => {
  // Validate request data
  const { error } = menuItemValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //   find document by id and update
  MenuItem.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    },
    { new: true },
    (error, menuItem) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(menuItem);
    }
  );
});

// DELETE delete a single food document
// the id provided should be the menu item id
router.delete(
  "/:id",
  auth,
  grantAccess("deleteAny", "menuItem"),
  (req, res) => {
    MenuItem.findByIdAndRemove(req.params.id, (error, menuItem) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "Success" });
    });
  }
);

module.exports = router;
