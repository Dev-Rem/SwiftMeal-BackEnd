const AccessControl = require("accesscontrol");

const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user")
    .readOwn("profile")
    .readOwn("address")
    .updateOwn("profile")
    .createOwn("address")
    .updateOwn("address")
    .deleteOwn("address")
    .readAny("restaurant")
    .readAny("menu")
    .readAny("menuItem")
    .createOwn("item")
    .readOwn("item")
    .updateOwn("item")
    .deleteOwn("item")
    .createOwn("cart")
    .updateOwn("cart")
    .readOwn("cart")
    .deleteOwn("cart")
    .createOwn("payment");

  ac.grant("admin")
    .extend("user")
    .createAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .createAny("restaurant")
    .updateAny("restaurant")
    .deleteAny("restaurant")
    .createAny("menu")
    .updateAny("menu")
    .deleteAny("menu")
    .createAny("menuItem")
    .updateAny("menuItem")
    .deleteAny("menuItem");

  return ac;
})();
