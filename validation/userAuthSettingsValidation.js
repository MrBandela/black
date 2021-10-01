
const joi = require('joi');
exports.schemaKeys = joi.object({
  loginOTP: joi.string().allow(null,''),
  expiredTimeOfLoginOTP: joi.date().allow(null,''),
  resetPasswordCode: joi.string().allow(null,''),
  expiredTimeOfResetPasswordCode: joi.date().allow(null,''),
  loginReactiveTime: joi.date().allow(null,''),
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  loginOTP: joi.string().allow(null,''),
  expiredTimeOfLoginOTP: joi.date().allow(null,''),
  resetPasswordCode: joi.string().allow(null,''),
  expiredTimeOfResetPasswordCode: joi.date().allow(null,''),
  loginReactiveTime: joi.date().allow(null,''),
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
