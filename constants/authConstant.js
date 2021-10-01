const JWT = {
  ADMIN_SECRET:'myjwtadminsecret',
  DEVICE_SECRET:'myjwtdevicesecret',
  EXPIRES_IN: 10000
};

const USER_ROLE = {
        
  Admin :1,
  User:2,
};

const PLATFORM = {
  ADMIN:1,
  DEVICE:2,
    
};

let LOGIN_ACCESS = {
  [USER_ROLE.User]:[PLATFORM.DEVICE],           
  [USER_ROLE.Admin]:[PLATFORM.ADMIN],           
};

const DEFAULT_ROLE = 1;

const ROLE_RIGHTS = {
    
  [USER_ROLE.User] : [
    'getAllByUserInDevicePlatform',
    'getByUserInDevicePlatform',
    'aggregateByUserInDevicePlatform',
    'getCountByUserInDevicePlatform',
    'createByUserInDevicePlatform',
    'addBulkByUserInDevicePlatform',
    'updateByUserInDevicePlatform',
    'updateBulkByUserInDevicePlatform',
    'partialUpdateByUserInDevicePlatform',
    'deleteByUserInDevicePlatform',
    'softDeleteByUserInDevicePlatform',
    'upsertByUserInDevicePlatform',
    'fileUploadByUserInDevicePlatform',
    'logoutByUserInDevicePlatform',
    'softDeleteManyByUserInDevicePlatform',
    'deleteManyByUserInDevicePlatform',
    'changePasswordByUserInDevicePlatform',
    'updateProfileByUserInDevicePlatform'
  ],
    
  [USER_ROLE.Admin] : [
    'getAllByAdminInAdminPlatform',
    'getByAdminInAdminPlatform',
    'aggregateByAdminInAdminPlatform',
    'getCountByAdminInAdminPlatform',
    'createByAdminInAdminPlatform',
    'addBulkByAdminInAdminPlatform',
    'updateByAdminInAdminPlatform',
    'updateBulkByAdminInAdminPlatform',
    'partialUpdateByAdminInAdminPlatform',
    'deleteByAdminInAdminPlatform',
    'softDeleteByAdminInAdminPlatform',
    'upsertByAdminInAdminPlatform',
    'fileUploadByAdminInAdminPlatform',
    'logoutByAdminInAdminPlatform',
    'softDeleteManyByAdminInAdminPlatform',
    'deleteManyByAdminInAdminPlatform',
    'changePasswordByAdminInAdminPlatform',
    'updateProfileByAdminInAdminPlatform'
  ],
    
};
const MAX_LOGIN_RETRY_LIMIT = 3;   
const LOGIN_REACTIVE_TIME = 720;

const SEND_LOGIN_OTP = {
  SMS:1,
  EMAIL:2,
};
const DEFAULT_SEND_LOGIN_OTP = SEND_LOGIN_OTP.SMS;

const FORGOT_PASSWORD_WITH = {
  LINK: {
    email: true,
    sms: false
  },
  EXPIRETIME: 3660
};

const NO_OF_DEVICE_ALLOWED = 1;

module.exports = {
  JWT,
  USER_ROLE,
  DEFAULT_ROLE,
  ROLE_RIGHTS,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  SEND_LOGIN_OTP,
  DEFAULT_SEND_LOGIN_OTP,
  FORGOT_PASSWORD_WITH,
  LOGIN_ACCESS,
  NO_OF_DEVICE_ALLOWED,
    
};