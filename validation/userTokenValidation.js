
const joi = require('joi');
exports.schemaKeys = joi.object({
  token: joi.string().allow(null,''),
  tokenExpiredTime: joi.date().allow(null,''),
  isTokenExpired: joi.boolean().default(false).allow(null,''),
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  token: joi.string().allow(null,''),
  tokenExpiredTime: joi.date().allow(null,''),
  isTokenExpired: joi.boolean().default(false).allow(null,''),
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
