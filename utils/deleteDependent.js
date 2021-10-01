let User = require('../model').user;
let UserAuthSettings = require('../model').userAuthSettings;
let UserToken = require('../model').userToken;
let Role = require('../model').role;
let ProjectRoute = require('../model').projectRoute;
let RouteRole = require('../model').routeRole;
let UserRole = require('../model').userRole;
const { Op } = require('sequelize');

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });        
    if (user && user.length){    
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userAuthSettingsFilter64913 = { 'userId': { [Op.in]: user } };
      const userAuthSettings39354 = await deleteUserAuthSettings(userAuthSettingsFilter64913);
      const userTokenFilter76941 = { 'userId': { [Op.in]: user } };
      const userToken91004 = await deleteUserToken(userTokenFilter76941);
      const userRoleFilter66790 = { 'userId': { [Op.in]: user } };
      const userRole12359 = await deleteUserRole(userRoleFilter66790);
      return await User.destroy({ where :filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    return await UserToken.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });        
    if (role && role.length){    
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter44426 = { 'roleId': { [Op.in]: role } };
      const routeRole89693 = await deleteRouteRole(routeRoleFilter44426);
      const userRoleFilter47850 = { 'roleId': { [Op.in]: role } };
      const userRole67855 = await deleteUserRole(userRoleFilter47850);
      return await Role.destroy({ where :filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });        
    if (projectroute && projectroute.length){    
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter37809 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole67182 = await deleteRouteRole(routeRoleFilter37809);
      return await ProjectRoute.destroy({ where :filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){    
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userAuthSettingsFilter42078 = { 'userId': { [Op.in]: user } };
      const userAuthSettings51540Cnt = await countUserAuthSettings(userAuthSettingsFilter42078);
      const userTokenFilter73148 = { 'userId': { [Op.in]: user } };
      const userToken48695Cnt = await countUserToken(userTokenFilter73148);
      const userRoleFilter45622 = { 'userId': { [Op.in]: user } };
      const userRole29892Cnt = await countUserRole(userRoleFilter45622);
      const userCnt =  await User.count({ where:filter });
      let response = { user : userCnt  };
      response = {
        ...response,
        ...userAuthSettings51540Cnt,
        ...userToken48695Cnt,
        ...userRole29892Cnt,
      };
      return response;
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count({ where:filter });
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count({ where:filter });
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){    
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter97442 = { 'roleId': { [Op.in]: role } };
      const routeRole08102Cnt = await countRouteRole(routeRoleFilter97442);
      const userRoleFilter61474 = { 'roleId': { [Op.in]: role } };
      const userRole01924Cnt = await countUserRole(userRoleFilter61474);
      const roleCnt =  await Role.count({ where:filter });
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole08102Cnt,
        ...userRole01924Cnt,
      };
      return response;
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){    
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter23443 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole98338Cnt = await countRouteRole(routeRoleFilter23443);
      const projectRouteCnt =  await ProjectRoute.count({ where:filter });
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole98338Cnt,
      };
      return response;
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count({ where:filter });
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count({ where:filter });
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,loggedInUserId) =>{
  try {
        
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){    
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userAuthSettingsFilter18904 = { 'userId': { [Op.in]: user } };
      const userAuthSettings94552 = await softDeleteUserAuthSettings(userAuthSettingsFilter18904,loggedInUserId);
      const userTokenFilter61964 = { 'userId': { [Op.in]: user } };
      const userToken27870 = await softDeleteUserToken(userTokenFilter61964,loggedInUserId);
      const userRoleFilter50298 = { 'userId': { [Op.in]: user } };
      const userRole41279 = await softDeleteUserRole(userRoleFilter50298,loggedInUserId);
      if (loggedInUserId){
        return await User.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await User.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter,
          });
      }
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,loggedInUserId) =>{
  try {
        
    if (loggedInUserId){
      return await UserAuthSettings.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserAuthSettings.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,loggedInUserId) =>{
  try {
        
    if (loggedInUserId){
      return await UserToken.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserToken.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,loggedInUserId) =>{
  try {
        
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){    
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter63860 = { 'roleId': { [Op.in]: role } };
      const routeRole98930 = await softDeleteRouteRole(routeRoleFilter63860,loggedInUserId);
      const userRoleFilter45764 = { 'roleId': { [Op.in]: role } };
      const userRole90993 = await softDeleteUserRole(userRoleFilter45764,loggedInUserId);
      if (loggedInUserId){
        return await Role.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await Role.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter,
          });
      }
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,loggedInUserId) =>{
  try {
        
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){    
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter95716 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole31641 = await softDeleteRouteRole(routeRoleFilter95716,loggedInUserId);
      if (loggedInUserId){
        return await ProjectRoute.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await ProjectRoute.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter,
          });
      }
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,loggedInUserId) =>{
  try {
        
    if (loggedInUserId){
      return await RouteRole.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await RouteRole.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,loggedInUserId) =>{
  try {
        
    if (loggedInUserId){
      return await UserRole.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserRole.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
