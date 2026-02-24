const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getUserById       = loadQuery('users', 'getUserById');
const updateUser        = loadQuery('users', 'updateUser');
const getAddressesByUser = loadQuery('users', 'getAddressesByUser');
const createAddress     = loadQuery('users', 'createAddress');
const setDefaultAddress = loadQuery('users', 'setDefaultAddress');

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

exports.getAddresses = async (userId) => {
  const { rows } = await db.query(getAddressesByUser, [userId]);
  return rows;
};

exports.createAddress = async (userId, { label, street, city, state, zip, is_default }) => {
  const { rows } = await db.query(createAddress, [userId, label, street, city, state, zip, is_default ?? false]);
  return rows[0];
};

exports.setDefaultAddress = async (userId, addressId) => {
  const { rows } = await db.query(setDefaultAddress, [userId, addressId]);
  if (!rows[0]) throw new ApiError(404, 'Address not found');
  return rows[0];
};
