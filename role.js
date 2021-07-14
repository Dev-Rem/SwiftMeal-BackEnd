const AccessControl = require("accesscontrol");

const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user")
    .readOwn("profile")
    .readOwn('address')
    .updateOwn("profile")
    .createOwn("address")
    .updateOwn("address")
    .deleteOwn("address")
    .readAny("restaurant")
    .readAny("menu")
    .readAny("section")
    .readAny("food")
    .createOwn("item")
    .readOwn("item")
    .updateOwn("item")
    .deleteOwn("item")
    .createOwn("cart")
    .updateOwn("cart")
    .readOwn("cart")
    .deleteOwn("cart");

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
    .createAny("section")
    .updateAny("section")
    .deleteAny("section")
    .createAny("food")
    .updateAny("food")
    .deleteAny("food");

  return ac;
})();
