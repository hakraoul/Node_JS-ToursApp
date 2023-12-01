const express = require('express');
const userContrller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router(); //middleware

//this don't follow,
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

//These routes follow RestAPI format
//User Route
router.route('/').get(userContrller.getAllUser).post(userContrller.createUser);
router
  .route('/:id')
  .get(userContrller.getUser)
  .patch(userContrller.updateUser)
  .delete(userContrller.deleteUser);

module.exports = router;
