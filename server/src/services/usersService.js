const bcrypt = require('bcryptjs');
const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getUserById        = loadQuery('users', 'getUserById');
const updateUser         = loadQuery('users', 'updateUser');
const getAddressesByUser = loadQuery('users', 'getAddressesByUser');
const createAddress      = loadQuery('users', 'createAddress');
const updateAddress      = loadQuery('users', 'updateAddress');
const setDefaultAddress  = loadQuery('users', 'setDefaultAddress');
const deleteAddress      = loadQuery('users', 'deleteAddress');
const changePasswordSQL  = loadQuery('users', 'changePassword');
const getUserByEmail     = loadQuery('auth',  'getUserByEmail');

exports.getById = async (id) => {
  const { rows } = await db.query(getUserById, [id]);
  if (!rows[0]) throw new ApiError(404, 'User not found');
  return rows[0];
};

exports.update = async (id, { first_name, last_name, phone }) => {
  const { rows } = await db.query(updateUser, [first_name, last_name, phone, id]);
  if (!rows[0]) throw new ApiError(404, 'User not found');
  return rows[0];
};

exports.changePassword = async (id, { current_password, new_password }) => {
  // Get user with hash to verify current password
  const { rows: userRows } = await db.query(
    'SELECT * FROM users WHERE id = $1', [id]
  );
  const user = userRows[0];
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await bcrypt.compare(current_password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Current password is incorrect');

  const hash = await bcrypt.hash(new_password, 12);
  await db.query(changePasswordSQL, [hash, id]);
};

exports.getAddresses = async (userId) => {
  const { rows } = await db.query(getAddressesByUser, [userId]);
  return rows;
};

exports.createAddress = async (userId, { label, street, city, state, zip, is_default }) => {
  // If this is set as default, unset others first
  if (is_default) {
    await db.query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]
    );
  }
  const { rows } = await db.query(createAddress, [
    userId, label, street, city, state, zip, is_default ?? false,
  ]);
  return rows[0];
};

exports.updateAddress = async (userId, addressId, { label, street, city, state, zip }) => {
  const { rows } = await db.query(updateAddress, [
    label, street, city, state, zip, addressId, userId,
  ]);
  if (!rows[0]) throw new ApiError(404, 'Address not found');
  return rows[0];
};

exports.setDefaultAddress = async (userId, addressId) => {
  const { rows } = await db.query(setDefaultAddress, [userId, addressId]);
  if (!rows[0]) throw new ApiError(404, 'Address not found');
  return rows[0];
};

exports.deleteAddress = async (userId, addressId) => {
  const { rows } = await db.query(deleteAddress, [addressId, userId]);
  if (!rows[0]) throw new ApiError(404, 'Address not found');
};
