const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/user');
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.post('/admin/user/create',auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.addUser({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res, result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.post('/admin/user/list',auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.findAllUser({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.get('/admin/user/:id',auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.findUserByPk(req.pathParams.id).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.route('/admin/user/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.findAllUser({
    data:{
      query: { ...req.body },
      isCountOnly:true 
    } 
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.put('/admin/user/update/:id',auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.updateUser(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});   
router.put('/admin/user/partial-update/:id',auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.partialUpdateUser(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});   
router.put('/admin/user/softDelete/:id',auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.softDeleteUser({
    pk:req.pathParams.id,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.put('/admin/user/softDeleteMany',auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.softDeleteManyUser(req.body.ids,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.post('/admin/user/addBulk',auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  userController.bulkInsertUser({
    body: req.body,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.put('/admin/user/updateBulk',auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,(req,res,next)=>{
  req = adaptRequest(req);
  userController.bulkUpdateUser(req.body).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
}); 

router.route('/admin/user/change-password').put(auth(...[ 'changePasswordByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  let params = {
    ...req.body,
    userId:req.user.id
  };
  userController.changePassword(params).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.route('/admin/user/update-profile').put(auth(...[ 'updateProfileByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userController.updateProfile(req.body,req.user.id).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});

module.exports = router;