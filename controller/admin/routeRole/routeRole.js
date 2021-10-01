
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const responseCode = require('../../../utils/responseCode');
const models = require('../../../model');
function makeRouteRoleController ({
  routeRoleService,makeRouteRole
})
{
  const addRouteRole = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const routeRole = makeRouteRole(originalData, 'insertRouteRoleValidator');
      let createdRouteRole = await routeRoleService.createOne(routeRole);
      return message.successResponse(
        { 'Content-Type': 'application/json' },
        responseCode.success,
        createdRouteRole
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

  const bulkInsertRouteRole = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const routeRoleEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeRouteRole(item,'insertRouteRoleValidator');
      });
      const results = await routeRoleService.createMany(routeRoleEntities);
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

  const findAllRouteRole = async ({
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
      query = routeRoleService.queryBuilderParser(query);
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.sort){
        options.order = routeRoleService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = routeRoleService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await routeRoleService.count(query, options);
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
        result = await routeRoleService.findMany(query, options);
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

  const findRouteRoleByPk = async (pk,options = {}) => {
    try {
      let result = await routeRoleService.findByPk(pk, options);
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

  const partialUpdateRouteRole = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = { id:id };
        let updatedRouteRole = await routeRoleService.updateMany(query,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedRouteRole
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

  const updateRouteRole = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = { id:pk };
        let updatedRouteRole = await routeRoleService.updateMany(query,filterData);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedRouteRole
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

  const softDeleteRouteRole = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedRouteRole;
        let query = { id:pk };
        updatedRouteRole = await routeRoleService.softDeleteMany(query, options,loggedInUser.id);
        return message.successResponse(
          { 'Content-Type': 'application/json' },
          responseCode.success,
          updatedRouteRole
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

  const upsertRouteRole = async (data)=>{
    try {
      if (data){
        let result = await routeRoleService.upsert(data);
        if (result){
          return message.successResponse(
            { 'Content-Type': 'application/json' },
            responseCode.success,
            'Data upserted successfully'
          );
        }
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

  const removeEmpty = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
      else if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
  };

  return Object.freeze({
    addRouteRole,
    bulkInsertRouteRole,
    findAllRouteRole,
    findRouteRoleByPk,
    partialUpdateRouteRole,
    updateRouteRole,
    softDeleteRouteRole,
    upsertRouteRole
  });
}

module.exports = makeRouteRoleController;
