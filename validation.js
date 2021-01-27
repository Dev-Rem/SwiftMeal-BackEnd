const Joi = require("joi");
const { model } = require("./models/address");

/* User registration validation */
const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(200).required(),
    lastName: Joi.string().max(200).required(),
    email: Joi.string().min(6).max(200).required().email(),
    phoneNumber: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return schema.validate(data);
};

/* User login validation */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(200).required().email(),
    password: Joi.string().min(6).max(30).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
