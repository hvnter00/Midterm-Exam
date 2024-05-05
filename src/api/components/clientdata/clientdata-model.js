const { number, string } = require('joi');
const mongoose = require('mongoose'); //menggunakan mongoose

const clientDataFormat = new mongoose.Schema({
  //const untuk setup format dari client data
  full_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: Number,
    required: true,
  },
  card_type: {
    type: String,
    required: true,
  },
});

const ClientData = mongoose.model('ClientData', clientDataFormat);
module.exports = ClientData;
