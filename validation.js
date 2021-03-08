const Joi = require("joi");

/* User registration validation */
exports.registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(200).required(),
    lastName: Joi.string().max(200).required(),
    email: Joi.string().min(6).max(200).required().email(),
    phoneNumber: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().required().max(6).min(4),
  });

  return schema.validate(data);
};

/* User login validation */
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(200).required().email(),
    password: Joi.string().min(6).max(30).required(),
  });
  return schema.validate(data);
};

/* Address validation */
exports.addressValidation = (data) => {
  const schema = Joi.object({
    streetNumber: Joi.string().max(200).required(),
    streetName: Joi.string().max(200).required(),
    city: Joi.string().max(200).required(),
    postalCode: Joi.number().required(),
    country: Joi.string().max(150).required(),
  });
  return schema.validate(data);
};

exports.restaurantValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(200),
    phoneNumber: Joi.string().required().min(6).max(30),
    email: Joi.string().min(6).max(200).required().email(),
  });

  return schema.validate(data);
};

exports.menuValidation = (data) => {
  const schema = Joi.object({
    restaurantId: Joi.string().required(),
    name: Joi.string().required(),
  });

  return schema.validate(data);
};
