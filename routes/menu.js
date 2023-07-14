const express = require("express");
const Menu = require("../models/menu");
const { auth, grantAccess } = require("./authController");
const { menuValidation } = require("../validation");
const router = express.Router();

/* Create new restaurant menu */
// the id passed should be the restuarant id
router.post(
  "/:id/",
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
        res.status(200).json(menu);
      }
    );
  }
);

/* Get all restaurant menus */
// the id passed should be the restuarant id
router.get("/:id", async (req, res) => {
  await Menu.find({ restaurantId: req.params.id }, (error, menus) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menus);
  });
});

/* Get a single menu document */
// the id passed should be the menu id
router.get("/menu/:id/", async (req, res) => {
  await Menu.findById(req.params.id, (error, menu) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menu);
  });
});

/* Update the a restarant menu */
// the id passed should be the menu id
router.put("/:id", auth, grantAccess("updateAny", "menu"), async (req, res) => {
  // Validate request data
  const { error } = menuValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update menu document
  await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, menu) => {
      if (error) return res.status(400).json({ error: error });
      menu.save();
      res.status(200).json(menu);
    }
  );
});

/* Delete a restaurant menu */
// the id passed should be the menu id
router.delete("/:id", auth, grantAccess("deleteAny", "menu"), (req, res) => {
  //  delete menu document
  Menu.findByIdAndRemove(req.params.id, async (error) => {
    if (error) return res.status(400).json({ error: error });

    res.status(200).json({
      status: "Success",
    });
  });
});

module.exports = router;
