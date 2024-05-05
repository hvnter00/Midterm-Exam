const clientData = require('./clientdata-model');
const { errorResponder, errorTypes } = require('../../../core/errors');

//IMPLEMENTASI OPERASI CRUD (CREATE, READ, UPDATE, DELETE) PADA CODE UNTUK CASE MOBILE/DIGITAL BANKING (NIM GENAP)
/**
 * Fungsi untuk memasukkan data nasabah(client) ke dalam database
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
async function inputClientData(request, response, next) {
  try {
    const { full_name, account_number, card_type } = request.body;
    if (account_number.toString().length !== 9) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Nomor Rekening yang Diinput Tidak Sesuai Ketentuan'
      );
    }

    const clientDataNew = new clientDataModel({
      full_name,
      account_number,
      card_type,
    });
    await clientData.save();
    return response.status(200).json(clientData);
  } catch (error) {
    return next(error);
  }
}

/**
 * Fungsi untuk mengeluarkan semua data nasabah
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
async function readClientData(requesyt, response, next) {
  try {
    const allClientData = await clientData.find({});
    return response.status(200).json(allClientData);
  } catch (error) {
    return next(error);
  }
}

/**
 * Fungsi untuk update card_type nasabah tertentu
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
async function upgradeCard(request, respose, next) {
  try {
    const noRek = request.params.account_number;
    const { card_type } = request.body;
    const upgradedCard = await clientData.findOneAndUpdate(
      { account_number: noRek },
      { card_type },
      { new: true }
    );
    if (!upgradedCard) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Data Nasabah Invalid'
      );
    }
    return response.status(200).json(upgradedCard);
  } catch (error) {
    return next(error);
  }
}

/**
 * Fungsi untuk menghapus data nasabah tertentu
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
async function deleteClientData(request, response, next) {
  try {
    const noRek = request.params.account_number;
    const deletedData = await clientData.findOneAndDelete({
      account_number: noRek,
    });
    if (!deletedData) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Data Nasabah Invalid'
      );
    }
    return response.status(200).json({ message: 'Data Nasabah Telah Dihapus' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  inputClientData,
  readClientData,
  upgradeCard,
  deleteClientData,
};
