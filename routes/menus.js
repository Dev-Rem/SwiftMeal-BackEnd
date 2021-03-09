const express = require("express");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const { auth, grantAccess } = require("./authController");
const { menuValidation } = require("../validation");
const router = express.Router();

/* Create new restaurant menu */
router.post(
  ":id/create/menu",
  auth,
  grantAccess("createAny", "menu"),
  async (req, res) => {
    // Validate request data
    const { error } = menuValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create new restaurant menu
    Menu.create(
      {
        restaurantId: req.params.id,
        name: req.body.name,
        description: req.body.description,
      },
      (error, menu) => {
        if (error) return res.status(400).json({ error: error });
        res.send(menu);
      }
    );
  }
);

/* Get all restaurant menus */
router.get("/:id", auth, grantAccess("readAny", "menu"), async (req, res) => {
  Menu.find({}, (error, menus) => {
    if (error) return res.status(400).json({ error: error });
    res.send(menus);
  });
});

module.exports = router;
