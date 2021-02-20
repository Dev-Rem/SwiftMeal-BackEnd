const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = () => {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile")
    .createOwn("address")
    .updateOwn("address")
    .deleteOwn("address");

  ac.grant("admin")
    .extend("user")
    .updateAny("profile")
    .deleteAny("profile")
    .createAny("restaurant")
    .readAny("restaurant")
    .updateAny("restaurant")
    .deleteAny("restaurant");
  return ac;
};
