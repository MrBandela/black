const userModel  = require('../../../model').user;
const userAuthSetting = require('../../../model').userAuthSettings;
const userToken = require('../../../model').userToken;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/userValidation');
const insertUserValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateUserValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeUser = require('../../../entity/user')({
  insertUserValidator,
  updateUserValidator
});
const userService = require('../../../services/dbService')({
  model:userModel,
  makeUser
});
const userAuthSettingService = require('../../../services/dbService')({ model:userAuthSetting });
const userTokenService = require('../../../services/dbService')({ model:userToken });
const authService = require('../../../services/auth')({
  makeUser,
  userService,
  userAuthSettingService,
  userTokenService
});
const makeUniqueValidation = require('../../../utils/common.js').makeUniqueValidation(userService);
const makeAuthController = require('./authController');
const authController = makeAuthController({
  authService,
  makeUniqueValidation,
  userService,
  userAuthSettingService,
  userTokenService,
  makeUser
});
module.exports = authController;