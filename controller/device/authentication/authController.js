const moment = require('moment');

const message = require('../../../utils/messages');
const responseCode = require('../../../utils/responseCode');

function makeAuthController ({
  authService,makeUniqueValidation,userService,userAuthSettingService,userTokenService,makeUser
}){
  const register = async ({ data }) => {
    try {
      const originalData = data;
      const user = makeUser(originalData, 'insertUserValidator');
      let unique = await makeUniqueValidation.uniqueValidation(user);
      if (!unique){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          'User Registration Failed, Duplicate data found'
        );
      }
      const result = await userService.createOne(user);
      return message.successResponse(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        result
      );
    }
    catch (e) {
      if (e.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          e.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        e.message
      );
    }
  };
  const forgotPassword = async (params) => {
    try {
      if (!params.email) {
        return message.insufficientParameters(
          { 'Content-Type': 'application/json' },
          responseCode.validationError
        );
      }
      let where = { email: params.email };
      params.email = params.email.toString().toLowerCase();
      let user = await userService.findOne(where);
      if (user) {
        let {
          resultOfEmail, resultOfSMS 
        } = await authService.sendResetPasswordNotification(user);
        if (resultOfEmail && resultOfSMS) {
          return message.requestValidated(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            'otp successfully send.'
          );
    
        } else if (resultOfEmail && !resultOfSMS) {
          return message.requestValidated(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            'otp successfully send to your email.'
          );
    
        } else if (!resultOfEmail && resultOfSMS) {
          return message.requestValidated(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            'otp successfully send to your mobile number.'
          );
        } else {
          return message.failureResponse(
            { 'Content-Type': 'application/json' },
            responseCode.internalServerError,
            'otp can not be sent due to some issue try again later'
          );
        }
      } else {
        return message.recordNotFound(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          {}
        );
      }
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };
    
  const validateResetPasswordOtp = async (params) => {
    try {
      if (!params || !params.otp) {
        return message.insufficientParameters(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
        );
      }
      let user = await userAuthSettingService.findOne({ resetPasswordCode: params.otp });
      if (!user || !user.resetPasswordCode) {
        return message.invalidRequest(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          'Invalid OTP'
        );
      }
      // link expire
      if (moment(new Date()).isAfter(moment(user.expiredTimeOfResetPasswordCode))) {
        return message.invalidRequest(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          'Your reset password link is expired.'
        );
      }
      return message.requestValidated(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        'OTP Validated'
      );
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };
    
  const resetPassword = async (params) => {
    try {
      if (!params.code || !params.newPassword) {
        return message.insufficientParameters(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
        );
      }
      let user = await userAuthSettingService.findOne({ resetPasswordCode: params.code });
      if (user && user.expiredTimeOfResetPasswordCode) {
        if (moment(new Date()).isAfter(moment(user.expiredTimeOfResetPasswordCode))) {// link expire
          return message.invalidRequest(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            'Your reset password link is expired.'
          );
        }
      } else {
        // invalid Code
        return message.invalidRequest(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          'Invalid Code'
        );
      }
      let response = await authService.resetPassword(user.userId, params.newPassword);
      if (response && !response.flag) {
        return message.requestValidated(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          response.data
        );
      } 
      return message.invalidRequest(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        response.data
      );
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };
  const sendOtpForLogin = async (data)=>{
    try {
      let params = data.body;
      if (!params.username || !params.password){
        return message.insufficientParameters(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
        );
      }
      let result = await authService.sendLoginOTP(params.username,params.password);
      if (!result.flag){
        return message.requestValidated(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          result.data
        );
      }
      return message.invalidRequest(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        result.data
      );
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };
  const loginWithOTP = async (data) => {
    const params = data.body;
    let url = data.url;
    try {
      if (!params.code || !params.username || !params.password) {
        return message.insufficientParameters(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
        );
      }
      let where = { [Op.or]:[{ username:params.username },{ email:params.username }] };
      let user = await userService.findOne(where);
      if (user){
        let userAuth = await userAuthSettingService.findOne({ userId:user.id });
        if (userAuth && userAuth.loginOTP && userAuth.expiredTimeOfLoginOTP){
          if (moment(new Date()).isAfter(moment(userAuth.expiredTimeOfLoginOTP))) {// link expire
            return message.loginFailed(
              { 'Content-Type': 'application/json' },
              responseCode.badRequest,
              'Your reset password link is expired or invalid'
            );
          }
          if (userAuth.loginOTP !== params.code) {
            return message.loginFailed(
              { 'Content-Type': 'application/json' },
              responseCode.badRequest,
              'Invalid Code'
            );
          }
        }
      } else {
        // invalid Code
        return message.loginFailed(
          { 'Content-Type': 'application/json' },
          responseCode.badRequest,
          'Invalid Code'
        );
      }
      let result = await authService.loginWithOTP(params.username, params.password, url);
      if (!result.flag) {
        return message.loginSuccess(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          result.data
        );
      } 
      return message.loginFailed(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        result.data
      );
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };
  const logout = async (req) => {
    try {
      if (req.user) {
        let userTokens = await userTokenService.findOne({
          token: (req.headers.authorization).replace('Bearer ', ''),
          userId:req.user.id 
        });
        userTokens.isTokenExpired = true;
        let id = userTokens.id;
        delete userTokens.id;
        await userTokenService.updateByPk(id, userTokens.toJSON());
        return message.requestValidated(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          'Logged out Successfully'
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    } catch (error) {
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  return Object.freeze({
    register,
    sendOtpForLogin,
    loginWithOTP,
    forgotPassword,
    resetPassword,
    validateResetPasswordOtp,
    logout,
  });
}

module.exports = makeAuthController;