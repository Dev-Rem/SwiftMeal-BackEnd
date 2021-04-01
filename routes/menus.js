const express = require("express");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const { auth, grantAccess } = require("./authController");
const { menuValidation } = require("../validation");
const router = express.Router();

/* Create new restaurant menu */
router.post(
  "/:restId/create",
  auth,
  grantAccess("createAny", "menu"),
  async (req, res) => {
    // Validate request data
    const { error } = menuValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create new restaurant menu
    Menu.create(
      {
        restaurantId: req.params.restId,
        name: req.body.name,
        description: req.body.description,
      },
      (error, menu) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(menu);
      }
    );
  }
);

/* Get all restaurant menus */
router.get("/:id", auth, grantAccess("readAny", "menu"), async (req, res) => {
  Menu.find({ restaurantId: req.params.id }, (error, menus) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menus);
  });
});

/* Get a single restaurant menu */
router.get(
  "/:menuId",
  auth,
  grantAccess("readAny", "menu"),
  async (req, res) => {
    Menu.findById(req.params.menuId, (error, menu) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(menu);
    });
  }
);

/* Update the a restarant menu */
router.put("/:menuId", auth, grantAccess("updateAny", "menu"), (req, res) => {
  // Validate request data
  const { error } = menuValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update menu document
  Menu.findByIdAndUpdate(
    req.params.menuId,
    {
      name: req.body.name,
      description: req.body.description,
    },
    { new: true },
    (error, menu) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(menu);
    }
  );
});

/* Delete a restaurant menu */
router.delete(
  "/:menuId",
  auth,
  grantAccess("deleteAny", "menu"),
  (req, res) => {
    //  delete menu document
    Menu.findByIdAndRemove(req.params.menuId, (error, menu) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "menu deleted" });
    });
  }
);

module.exports = router;
