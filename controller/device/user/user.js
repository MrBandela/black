
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const responseCode = require('../../../utils/responseCode');
const models = require('../../../model');
function makeUserController ({
  userService,makeUser,authService
})
{
  const addUser = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const user = makeUser(originalData, 'insertUserValidator');
      let createdUser = await userService.createOne(user);
      return message.successResponse(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        createdUser
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const findAllUser = async ({
    data,loggedInUser
  }) => {
    try {
      let query = {};
      let options = {};
      if (data.query !== undefined){
        query = { ...data.query };
      }
      if (data.options !== undefined){
        options = { ...data.options };
      }
      query = userService.queryBuilderParser(query);
      if (loggedInUser){
        query = {
          ...query,
          [Op.ne]: loggedInUser.id
        };
        if (data.query && data.query.id) {
          Object.assign(query.id, { [Op.in]: [data.query.id] });
        }
      } else {
        return message.badRequest(
          { 'Content-Type': 'application/json' },
          responseCode.badRequest,
          {}
        );
      }
      if (options && options.select && options.select.length){
        options.attributes = [ 'username', 'password', 'email' ].filter(Set.prototype.has, new Set(options.select));
      } else {
        options.attributes = [ 'username', 'password', 'email' ];
      }
      if (options && options.sort){
        options.order = userService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = userService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await userService.count(query, options);
        if (result) {
          result = { totalRecords: result };  
        } else {
          return message.recordNotFound(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            {}
          );
        }
      } else {
        result = await userService.findMany(query, options);
      }
      if (result){
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          result
        );
      } else {
        return message.badRequest(
          { 'Content-Type': 'application/json' },
          responseCode.badRequest,
          {}
        );
      }
              
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const findUserByPk = async (pk,options = {}) => {
    try {
      options.attributes = [ 'username', 'password', 'email' ];
      let result = await userService.findByPk(pk, options);
      if (result){
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          result
        );
      } else {
        return message.recordNotFound(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          {}
        );
      }
            
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const updateUser = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            'id': {
              [Op.eq]: pk,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest(
            { 'Content-Type': 'application/json' },
            responseCode.badRequest,
            {}
          );
        }
        let updatedUser = await userService.updateMany(query,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedUser
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const partialUpdateUser = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            'id': {
              [Op.eq]: id,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest(
            { 'Content-Type': 'application/json' },
            responseCode.badRequest,
            {}
          );
        }
        let updatedUser = await userService.updateMany(query,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedUser
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const softDeleteUser = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedUser;
        let query = {};
        if (loggedInUser){
          query = {
            id: {
              [Op.eq]: pk,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest(
            { 'Content-Type': 'application/json' },
            responseCode.badRequest,
            {}
          );
        }
        updatedUser = await deleteDependentService.softDeleteUser(query,loggedInUser.id);            
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedUser
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const softDeleteManyUser = async (ids,loggedInUser) => {
    try {
      if (ids){
        let query = {};
        if (loggedInUser){
          query = {
            id: {
              [Op.in]: ids,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest(
            { 'Content-Type': 'application/json' },
            responseCode.badRequest,
            {}
          );
        }
        let data = await deleteDependentService.softDeleteUser(query,loggedInUser.id);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          data
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const bulkInsertUser = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const userEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeUser(item,'insertUserValidator');
      });
      const results = await userService.createMany(userEntities);
      return message.successResponse(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        results
      );
    } catch (error){
      if (error.name === 'ValidationError') {
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };

  const bulkUpdateUser = async (data,loggedInUser) =>{
    try {
      if (data.filter && data.data){
        delete data.data.addedBy;
        delete data.data.updatedBy;
        data.data.updatedBy = loggedInUser.id;
        const user = makeUser(data.data,'updateUserValidator');
        const filterData = removeEmpty(user);
        const updatedUsers = await userService.updateMany(data.filter,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedUsers
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message);
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message);
    }
  };

  const changePassword = async (params) => {
    try {
      if (!params.newPassword || !params.userId || !params.oldPassword) { 
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          'Please Provide userId and Password'
        );
      }
      let result = await authService.changePassword(params);
      if (result.flag) {
        return message.invalidRequest(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          result.data
        );
      }
      return message.requestValidated(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        result.data
      );
    } catch (error) {
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };     

  const updateProfile = async (data,id) =>{
    try {
      if (id && data){
        if (data.password) delete data.password;
        if (data.createdAt) delete data.createdAt;
        if (data.updatedAt) delete data.updatedAt;
        if (data.id) delete data.id;
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let updatedUser = await userService.updateByPk(id,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedUser
        );
      }
      return message.badRequest(
        { 'Content-Type': 'application/json' },
        responseCode.badRequest,
        {}
      );
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam(
          { 'Content-Type': 'application/json' },
          responseCode.validationError,
          error.message
        );
      }
      return message.failureResponse(
        { 'Content-Type': 'application/json' },
        responseCode.internalServerError,
        error.message
      );
    }
  };   

  const removeEmpty = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
      else if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
  };

  return Object.freeze({
    addUser,
    findAllUser,
    findUserByPk,
    updateUser,
    partialUpdateUser,
    softDeleteUser,
    softDeleteManyUser,
    bulkInsertUser,
    bulkUpdateUser,
    changePassword,
    updateProfile
  });
}

module.exports = makeUserController;
