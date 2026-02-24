const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getAllCategories = loadQuery('categories', 'getAllCategories');
const createCategory  = loadQuery('categories', 'createCategory');
const updateCategory  = loadQuery('categories', 'updateCategory');

exports.getAll = async () => {
  const { rows } = await db.query(getAllCategories);
  return rows;
};

exports.create = async ({ name, slug, description }) => {
  const { rows } = await db.query(createCategory, [name, slug, description]);
  return rows[0];
};

exports.update = async (id, { name, slug, description }) => {
  const { rows } = await db.query(updateCategory, [name, slug, description, id]);
  if (!rows[0]) throw new ApiError(404, 'Category not found');
  return rows[0];
};
