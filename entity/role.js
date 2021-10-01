
function buildMakeRole ({
  insertRoleValidator,updateRoleValidator
}){
  return function makeRole (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertRoleValidator':
      isValid = insertRoleValidator(data);
      break;

    case 'updateRoleValidator':
      isValid = updateRoleValidator(data);  
      break; 
    }
    if (isValid.error){
      throw new Error({
        name:'ValidationError',
        message:`Invalid data in Role entity. ${isValid.error}`
      });
    }
      
    return {
      name:data.name,
      code:data.code,
      weight:data.weight,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
      id:data.id,
    };
  };
}
module.exports =  buildMakeRole;
