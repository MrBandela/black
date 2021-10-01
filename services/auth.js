const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,DEFAULT_SEND_LOGIN_OTP,SEND_LOGIN_OTP,FORGOT_PASSWORD_WITH,NO_OF_DEVICE_ALLOWED
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const moment = require('moment');
const emailService = require('./email/emailService');
const sendSMS = require('./sms/smsService');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

async function generateToken (user,secret){
  return jwt.sign( {
    id:user.id,
    'username':user.username
  }, secret, { expiresIn: JWT.EXPIRES_IN });
}

function makeAuthService ({
  userService,userAuthSettingService,userTokenService
}) {
  const loginUser = async (username,password,url) => {
    try {
      let where = { [Op.or]:[{ username:username },{ email:username }] };
      const user = await userService.findOne(where);
      if (user) {
        const userAuth = await userAuthSettingService.findOne({ userId: user.id });
        const userToken = await userTokenService.count({
          [Op.and]:{
            tokenExpiredTime: { [Op.gt]: moment().toISOString() },
            isTokenExpired: 0,
            userId:user.id 
          } 
        } );
        if (userToken >= NO_OF_DEVICE_ALLOWED){
          return {
            flag: true,
            data: 'You\'ve reached your device limit'
          };
        }
        if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
          if (userAuth.loginReactiveTime) {
            let now = moment();
            let limitTime = moment(userAuth.loginReactiveTime);
            if (limitTime > now) {
              let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
              await userAuthSettingService.updateMany({ userId:user.id }, {
                loginReactiveTime: expireTime,
                loginRetryLimit: userAuth.loginRetryLimit + 1
              });
              return {
                flag: true,
                data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
              };
            }
          } else {
            // send error
            let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
            await userAuthSettingService.updateMany({ userId:user.id }, {
              loginReactiveTime: expireTime,
              loginRetryLimit: userAuth.loginRetryLimit + 1
            });
            return {
              flag: true,
              data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
            };
          }
        }
        const isPasswordMatched = await user.isPasswordMatch(password);
        if (isPasswordMatched) {
          const {
            password,...userData
          } = user.toJSON();
          let token;
          if (!user.role){
            return {
              flag:true,
              data:'You have not assigned any role'
            };
          }
          if (url.includes('admin')){
            if (!LOGIN_ACCESS[user.role].includes(PLATFORM.ADMIN)){
              return {
                flag:true,
                data:'you are unable to access this platform'
              };
            }
            token = await generateToken(userData,JWT.ADMIN_SECRET);
          }
          else if (url.includes('device')){
            if (!LOGIN_ACCESS[user.role].includes(PLATFORM.DEVICE)){
              return {
                flag:true,
                data:'you are unable to access this platform'
              };
            }
            token = await generateToken(userData,JWT.DEVICE_SECRET);
          }
          if (userAuth && userAuth.loginRetryLimit){
            await userAuthSettingService.updateMany({ userId:user.id }, {
              loginRetryLimit: 0,
              loginReactiveTime: null
            });
          }
          let expire = moment().add(JWT.EXPIRES_IN, 'seconds').toISOString();
          await userTokenService.createOne({
            userId: user.id,
            token: token,
            tokenExpiredTime: expire 
          });
          const userToReturn = {
            ...userData,
            ...{ token } 
          };
          return {
            flag:false,
            data:userToReturn
          };
        } else {
          await userAuthSettingService.updateMany({ userId:user.id },{ loginRetryLimit:userAuth.loginRetryLimit + 1 });
          return {
            flag:true,
            data:'Incorrect Password'
          };
        }
      } else {
        return {
          flag:true,
          data:'User not exists'
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const changePassword = async (params)=>{
    try {
      let password = params.newPassword;
      let oldPassword = params.oldPassword;
      let where = { id:params.userId };
      let user = await userService.findOne(where);
      if (user && user.id) {
        const isPasswordMatched = await user.isPasswordMatch(oldPassword);
        if (!isPasswordMatched){
          return {
            flag:true,
            data:'Incorrect Old Password'
          };
        }
        password = await bcrypt.hash(password, 8);
        let updatedUser = userService.updateByPk(user.id,{ password:password });
        if (updatedUser) {
          return {
            flag:false,
            data:'Password changed successfully'
          };                
        }
        return {
          flag:true,
          data:'password can not changed due to some error.please try again'
        };
      }
      return {
        flag:true,
        data:'User not found'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const sendResetPasswordNotification = async (user) => {
    let resultOfEmail = false;
    let resultOfSMS = false;
    try {
      let token = uuid();
      let expires = moment();
      expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minutes').toISOString();
      await userAuthSettingService.updateMany({ userId:user.id },
        {
          resetPasswordCode: token,
          expiredTimeOfResetPasswordCode: expires
        });
      if (FORGOT_PASSWORD_WITH.LINK.email){
        let viewType = '/reset-password/';
        let msg = 'Click on the link below to reset your password.';
        let mailObj = {
          subject: 'Reset Password',
          to: user.email,
          template: '/views/resetPassword',
          data: {
            link: `http://localhost:${process.env.PORT}` + viewType + token,
            linkText: 'Reset Password',
            message:msg
          }
        };
        try {
          await emailService.sendMail(mailObj);
          resultOfEmail = true;
        } catch (error){
          console.log(error);
        }
      }
      if (FORGOT_PASSWORD_WITH.LINK.sms){
        let viewType = '/reset-password/';
        let msg = `Click on the link to reset your password.
                http://localhost:${process.env.PORT}${viewType + token}`;
        let smsObj = {
          to:user.mobileNo,
          message:msg
        };
        try { 
          await sendSMS(smsObj);
          resultOfSMS = true;
        } catch (error){ 
          console.log(error);
        }
      }
      return {
        resultOfEmail,
        resultOfSMS
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
    
  const resetPassword = async (userId, newPassword) => {
    try {
      let where = { id: userId };
      const dbUser = await userService.findOne(where);
      if (!dbUser) {
        return {
          flag: false,
          data: 'User not found',
        };
      }
      newPassword = await bcrypt.hash(newPassword, 8);
      let updatedUser = await userService.updateByPk(userId, { password: newPassword });
      if (!updatedUser) {
        return {
          flag: true,
          data: 'Password is not reset successfully',
        };
      }
      await userAuthSettingService.updateMany({ userId:userId }, {
        resetPasswordCode: '',
        expiredTimeOfResetPasswordCode: null,
        loginRetryLimit: 0 
      });
      let mailObj = {
        subject: 'Reset Password',
        to: dbUser.email,
        template: '/views/successfullyResetPassword',
        data: {
          isWidth: true,
          email: dbUser.email || '-',
          message: 'Password Successfully Reset'
        }
      };
      await emailService.sendMail(mailObj);
      return {
        flag: false,
        data: 'Password reset successfully',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
    
  async function sendSMSForLoginOtp (user) {
    try {
      let otp = common.randomNumber();
      let expires = moment();
      expires = expires.add(6, 'hours').toISOString();
      await userAuthSettingService.updateMany({ userId:user.id }, {
        loginOTP: otp,
        expiredTimeOfLoginOTP: expires
      });
      let message = `OTP code for Login `;
      let otpMsg = `${message}: ${otp}`;
      let smsObj = {
        to:user.mobileNo,
        message:otpMsg
      };
      await sendSMS(smsObj);
      return true;
    } catch (error) {
      return false;
    }
  }
  const sendLoginOTP = async (username,password) => {
    try {
      let where = { [Op.or]:[{ username:username },{ email:username }] };
      let user = await userService.findOne(where);
      if (!user){
        return {
          flag:true,
          data:'User not found'
        };
      }
      let userAuth = await userAuthSettingService.findOne({ userId: user.id });
      if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
        if (userAuth.loginReactiveTime) {
          let now = moment();
          let limitTime = moment(userAuth.loginReactiveTime);
          if (limitTime > now) {
            let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
            await userAuthSettingService.updateMany({ userId:user.id }, {
              loginReactiveTime: expireTime,
              loginRetryLimit: userAuth.loginRetryLimit + 1
            });
            return {
              flag: true,
              data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
            };
          }
        } else {
          let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
          await userAuthSettingService.updateMany({ userId:user.id }, {
            loginReactiveTime: expireTime,
            loginRetryLimit: userAuth.loginRetryLimit + 1
          });
          return {
            flag: true,
            data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
          };
        }
      }
      const isPasswordMatched = await user.isPasswordMatch(password);
      if (!isPasswordMatched) {
        await userAuthSettingService.updateMany({ userId:user.id },{ loginRetryLimit:user.loginRetryLimit + 1 });
        return {
          flag:true,
          data:'Incorrect Password'
        };
      }
      let res;
      if (DEFAULT_SEND_LOGIN_OTP === SEND_LOGIN_OTP.EMAIL){
        // send Email here
      } else if (DEFAULT_SEND_LOGIN_OTP === SEND_LOGIN_OTP.SMS){
        // send SMS here
        if (userAuth.loginReactiveTime) {
          await userAuthSettingService.updateMany({ userId:user.id }, {
            loginRetryLimit: 0,
            loginReactiveTime: null 
          });
        }    
        res = await sendSMSForLoginOtp(user);
      }
      if (!res){
        return {
          flag:true,
          data:'otp can not be sent due to some issue try again later.'
        };    
      }
      return {
        flag:false,
        data:'Please check your email for OTP'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const loginWithOTP = async (username, password, url) => {
    try {
      let result = await loginUser(username, password, url);
      if (!result.flag) {
        await userAuthSettingService.updateMany({ userId:result.data.id }, {
          loginOTP: '',
          expiredTimeOfLoginOTP: null 
        });
      }
      return result;        
    } catch (error) {
      throw new Error(error.message);
    }
  };
    
  return Object.freeze({
    loginUser,
    changePassword,
    resetPassword,
    sendResetPasswordNotification,
    sendLoginOTP,
    loginWithOTP,
  });
}

module.exports = makeAuthService;