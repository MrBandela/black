
function buildMakeUser ({
  insertUserValidator,updateUserValidator
}){
  return function makeUser (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserValidator':
      isValid = insertUserValidator(data);
      break;

    case 'updateUserValidator':
      isValid = updateUserValidator(data);  
      break; 
    }
    if (isValid.error){
      throw new Error({
        name:'ValidationError',
        message:`Invalid data in User entity. ${isValid.error}`
      });
    }
      
    return {
      username:data.username,
      password:data.password,
      email:data.email,
      name:data.name,
      id:data.id,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
    };
  };
}
module.exports =  buildMakeUser;
