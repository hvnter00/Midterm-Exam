const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const clientDataControllers = require('./clientdata-controller');
const route = express.Router();

route.post(
  //route untuk fungsi create
  '/clientdata', //endpoint yang digunakan adalah client data
  authenticationMiddleware,
  clientDataControllers.inputClientData
);

route.get(
  //route untuk fungsi read
  '/clientdata', //endpoint yang digunakan mengambil dari client data
  authenticationMiddleware,
  clientDataControllers.readClientData
);

route.put(
  //route untuk fungsi update
  '/clientdata/:account_number', //endpoint client data
  authenticationMiddleware, //ditambah dengan acc number untuk masuk ke data tertentu
  clientDataControllers.upgradeCard
);

route.delete(
  '/clientdata/:account_number', //endpoint client data
  authenticationMiddleware, //ditambah dengan acc number untuk masuk ke data tertentu
  clientDataControllers.deleteClientData
);

module.exports = route;
