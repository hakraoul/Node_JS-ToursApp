const express = require('express');
const userContrller = require('../controllers/userController');

const route = express.Router(); //middleware

//User Route
route.route('/').get(userContrller.getAllUser).post(userContrller.createUser);
route
  .route('/:id')
  .get(userContrller.getUser)
  .patch(userContrller.updateUser)
  .delete(userContrller.deleteUser);

module.exports = route;
