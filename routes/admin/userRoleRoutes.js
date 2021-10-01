const express = require('express');
const router = express.Router();
const userRoleController = require('../../controller/admin/userRole');
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const auth = require('../../middleware/auth');

router.post('/admin/userrole/create',auth(...[ 'createByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.addUserRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res, result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.post('/admin/userrole/addBulk',auth(...[ 'addBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  userRoleController.bulkInsertUserRole({
    body: req.body,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.post('/admin/userrole/list',auth(...[ 'getAllByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.findAllUserRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.get('/admin/userrole/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.findUserRoleByPk(req.pathParams.id).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.put('/admin/userrole/partial-update/:id',auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.partialUpdateUserRole(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});   
router.put('/admin/userrole/update/:id',auth(...[ 'updateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.updateUserRole(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});   
router.put('/admin/userrole/softDelete/:id',auth(...[ 'softDeleteByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.softDeleteUserRole({
    pk:req.pathParams.id,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});
router.route('/admin/userrole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.findAllUserRole({
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
router.post('/admin/userrole/upsert',auth(...[ 'upsertByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  userRoleController.upsertUserRole(req.body).then((result)=>{
    sendResponse(res,result);
  })
    .catch((e) => {
      sendResponse(res,e);
    });
});

module.exports = router;