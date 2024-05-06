const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const clientDataControllers = require('./clientdata-controller');
const route = express.Router();

module.exports = (app) => {
  app.use('/clientdata', route);
  route.post(
    //route untuk fungsi create
    '/', //endpoint yang digunakan adalah client data
    authenticationMiddleware,
    clientDataControllers.inputClientData //menggunakan fungsi inputClientData dari controller
  );

  route.get(
    //route untuk fungsi read
    '/', //endpoint yang digunakan mengambil dari client data
    authenticationMiddleware,
    clientDataControllers.readClientData //menggunakan fungsi readClientData dari controller
  );

  route.put(
    //route untuk fungsi update
    '/:account_number', //endpoint client data
    authenticationMiddleware, //ditambah dengan acc number untuk masuk ke data tertentu
    clientDataControllers.upgradeCard //menggunakan fungsi upgradeCard dari controller
  );

  route.delete(
    '/:account_number', //endpoint client data
    authenticationMiddleware, //ditambah dengan acc number untuk masuk ke data tertentu
    clientDataControllers.deleteClientData //menggunakan fungsi deleteClientData dari controller
  );
};
