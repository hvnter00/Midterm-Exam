const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { now } = require('lodash');
const loginAttemptsLimit = 5; //Limit login attempts ke 5 kali percobaan
const loginCooldownDuration = 60000 * 30; //waktu batasan limit login selama 30 menit (dalam ms)
const loginAttemptsLog = {}; //variable yang menyimpan record dari percobaan login user

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  try {
    const current = Date.now();
    if (
      //Memeriksa login attempt sudah mencapai limit atau belum
      loginAttemptsLog[email] &&
      loginAttemptsLog[email].attempts >= loginAttemptsLimit && //percobaan login >= limit percobaan
      current - loginAttemptsLog[email].timestamp < loginCooldownDuration
    ) {
      throw new Error('Too many failed login attempts.'); //error message
    }

    const user = await authenticationRepository.getUserByEmail(email);

    // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
    // to handle the case when the user login is invalid. We still want to
    // check the password anyway, so that it prevents the attacker in
    // guessing login credentials by looking at the processing time.
    const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
    const passwordChecked = await passwordMatched(password, userPassword);

    // Because we always check the password (see above comment), we define the
    // login attempt as successful when the `user` is found (by email) and
    // the password matches.
    if (user && passwordChecked) {
      delete loginAttemptsLog[email]; //Jika user berhasil login, maka counter percoban akan kembali ke awal
      return {
        email: user.email,
        name: user.name,
        user_id: user.id,
        token: generateToken(user.email, user.id),
      };
    } else {
      loginAttemptsLog[email] = {
        //else jika login gagal
        attempts:
          (loginAttemptsLog[email] ? loginAttemptsLog[email].attempts : 0) + 1, //Login attempts counter akan merecord percobaan (+ 1)
        timestamp: current,
      };
      return null;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkLoginCredentials,
};
