const AccessControl = require("accesscontrol");

const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile")
    .createOwn("address")
    .updateOwn("address")
    .deleteOwn("address")
    .readAny("restaurant")
    .readAny("menu")
    .readAny("section");

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
    .deleteAny("section");

  return ac;
})();
