
const joi = require('joi');
exports.schemaKeys = joi.object({
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  isActive: joi.boolean().allow(null,''),
  isDeleted: joi.boolean().allow(null,'')
}).unknown(true);
