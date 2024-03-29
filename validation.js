const Joi = require("joi");

/* User registration validation */
exports.registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(200).required(),
    lastName: Joi.string().max(200).required(),
    email: Joi.string().min(6).max(200).required().email(),
    phoneNumber: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().max(6).min(4),
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
    name: Joi.string().required().min(3).max(1024),
    phoneNumber: Joi.string().required().min(6).max(1024),
    email: Joi.string().min(6).max(1024).required().email(),
    restaurantInfo: Joi.string(),
    image: Joi.string(),
  });
  return schema.validate(data);
};

exports.menuValidation = (data) => {
  const schema = Joi.object({
    restaurantId: Joi.string(),
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.menuItemValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().integer().required(),
    description: Joi.string(),
    image: Joi.string(),
  });
  return schema.validate(data);
};

exports.itemValidation = (data) => {
  const schema = Joi.object({
    discount: Joi.number().integer(),
    quantity: Joi.number().integer().required(),
  });
  return schema.validate(data);
};
