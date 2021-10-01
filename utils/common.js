
/*
 * convertObjectToEnum : convert object to enum
 * @param obj          : {}
 */
function convertObjectToEnum (obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(String(val)));
  return enumArr;
};

/*
 * randomNumber : generate random numbers.
 * @param length          : number *default 4
 */
function randomNumber (length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

/*
 * replaceAll: find and replace al; occurrence of a string in a searched string
 * @param string : string to be replace
 * @param search : string which you want to replace
 * @param replace: string with which you want to replace a string
 */
const replaceAll = (string, search, replace) => string.split(search).join(replace);

function makeUniqueValidation (userService) {
  const uniqueValidation = async (data) =>{
    const { Op } = require('sequelize');
    let filter = { [Op.or]:[] };
    if (data && data['username']){
      filter[Op.or].push(
        { 'username':data['username'] },
        { 'email':data['username'] },
      );
    }
    if (data && data['email']){
      filter[Op.or].push(
        { 'username':data['email'] },
        { 'email':data['email'] },
      );
    }
    let found = await userService.findOne(filter);
    if (found){
      return false;
    }
    return true;
  };
  return Object.freeze({ uniqueValidation });
}

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  makeUniqueValidation,
};
