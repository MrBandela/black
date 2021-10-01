
function buildMakeRouteRole ({
  insertRouteRoleValidator,updateRouteRoleValidator
}){
  return function makeRouteRole (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertRouteRoleValidator':
      isValid = insertRouteRoleValidator(data);
      break;

    case 'updateRouteRoleValidator':
      isValid = updateRouteRoleValidator(data);  
      break; 
    }
    if (isValid.error){
      throw new Error({
        name:'ValidationError',
        message:`Invalid data in RouteRole entity. ${isValid.error}`
      });
    }
      
    return {
      routeId:data.routeId,
      roleId:data.roleId,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
      id:data.id,
    };
  };
}
module.exports =  buildMakeRouteRole;
