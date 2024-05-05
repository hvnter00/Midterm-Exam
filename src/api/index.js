const express = require('express');
const app = express();

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const clientDataRoute = require('./components/clientdata/clientdata-route'); //menambah route untuk client data

module.exports = () => {
  const app = express.Router();
  authentication(app);
  users(app);
  return app;
};
