const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { User } = require('../../../models');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * No 1 - Pagination, Sort and Filter
 * (IMPLEMENTASI PAGINATION)
 * @param {number} pageNumbering Parameter for page number
 * @param {number} pageSizing Parameter for page size
 * (IMPLEMENTASI SORT DAN FILTER)
 * @param {string} fieldNameForSearch
 * @param {string} keyForSearch
 * @param {string} fieldNameForSort
 * @param {string} orderForSort
 * @returns {promise} Mereturn users list dengan tambahan pagination, sort dan filter
 */

async function getUsersWithNumbering(
  pageNumbering,
  pageSizing,
  fieldNameForSearch,
  keyForSearch,
  fieldNameForSort,
  orderForSort
) {
  try {
    let query = {}; //setup untuk query
    if (fieldNameForSearch && keyForSearch) {
      query[fieldNameForSearch] = { $regex: keyForSearch, $options: 'm' };
    } //fungsi $regex digunakan untuk search string, ditambahkan dengan penggunaan $options 'm' yang melakukan search di setiap baris, tidak hanya satu saja

    let sort = {}; //jika field kosong, maka sort email secara ascending
    if (fieldNameForSort === 'name') {
      sort = {
        //kondisi jika field tidak kosong
        name: orderForSort === 'desc' ? -1 : 1,
      };
    } else {
      sort = {
        //kondisi jika field tidak kosong
        email: orderForSort === 'desc' ? -1 : 1,
      };
    }

    const skip = (pageNumbering - 1) * pageSizing; //mengeluarkan output data sesuai dengan halaman
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSizing); //melimitasi data yang keluar agar sesuai input user
    const totalUsers = await User.countDocuments(query); //count jumlah data seluruh user yang ada pada database
    const totalPages = Math.ceil(totalUsers / pageSizing); //menghitung jumlah halaman pada output untuk page_size = n

    const output = {
      //Return output sesuai dengan format yang diminta pada soal
      page_number: pageNumbering,
      page_size: pageSizing,
      //menghitung jumlah data yang ada pada page_size = n
      //sehingga jika total data < input page_size -> count = total data
      count: users.length,
      total_pages: totalPages,
      //memeriksa apakah ada halaman selanjutnya
      has_previous_page: pageNumbering > 1,
      //memeriksa apakah ada halaman sebelumnya
      has_next_page: pageNumbering < totalPages,
      data: users.map((user) => ({
        //output data user yang sesuai dengan format, hanya id, name dan email
        //password tidak dikeluarkan pada output
        id: user._id,
        name: user.name,
        email: user.email,
      })),
    };
    return output;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getUsersWithNumbering,
};
