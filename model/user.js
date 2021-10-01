const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
function makeModel (sequelize){
  const User = sequelize.define('user',{
    username:{ type:DataTypes.STRING },
    password:{ type:DataTypes.STRING },
    email:{ type:DataTypes.STRING },
    name:{ type:DataTypes.STRING },
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    isActive:{ type:DataTypes.BOOLEAN },
    isDeleted:{ type:DataTypes.BOOLEAN },
    role:{
      type:DataTypes.INTEGER,
      required:true
    }
  }
  ,{
    hooks:{
      beforeCreate: [
        async function (user,options){
          if (user.password){ user.password =
          await bcrypt.hash(user.password, 8);}
          user.isActive = true;
          user.isDeleted = false;
        },
      ],
      afterCreate: [
        async function (user,options){
          sequelize.model('userAuthSettings').create({ userId:user.id });
        },
      ],
    } 
  }
  );
  User.prototype.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };
  User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());
    
    return values;
  };
  sequelizeTransforms(User);
  sequelizePaginate.paginate(User);
  return User;
}
module.exports = makeModel;