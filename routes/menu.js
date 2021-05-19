const express = require("express");
const Section = require("../models/section");
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
    await Menu.create(
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
router.get("/:restId", async (req, res) => {
  await Menu.find({ restaurantId: req.params.restId }, (error, menus) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menus);
  });
});

/* Get a single menu document */
router.get("/:restId/:menuId", async (req, res) => {
  await Menu.findById(req.params.menuId, (error, menu) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menu);
  });
});

/* Update the a restarant menu */
router.put(
  "/:menuId",
  auth,
  grantAccess("updateAny", "menu"),
  async (req, res) => {
    // Validate request data
    const { error } = menuValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update menu document
    await Menu.findByIdAndUpdate(
      req.params.menuId,
      req.body,
      { new: true },
      (error, menu) => {
        if (error) return res.status(400).json({ error: error });
        menu.save();
        res.status(200).json(menu);
      }
    );
  }
);

/* Delete a restaurant menu */
router.delete(
  "/:menuId",
  auth,
  grantAccess("deleteAny", "menu"),
  (req, res) => {
    //  delete menu document
    Menu.findByIdAndRemove(req.params.menuId, async (error) => {
      if (error) return res.status(400).json({ error: error });

      // find and delete all sections under this menu
      const deleted_sections = await Section.deleteMany({
        menuId: req.params.menuId,
      });
      res.status(200).json({
        status: "Success",
        deleted_sections: deleted_sections.deletedCount,
      });
    });
  }
);

module.exports = router;
