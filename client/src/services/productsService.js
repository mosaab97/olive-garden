import api from '../api/axiosInstance';

export const getAll = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const getBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

export const create = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const update = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const remove = async (id) => {
  await api.delete(`/products/${id}`);
};

// Variants
export const getVariants = async (productId) => {
  const res = await api.get('/variants', { params: { product_id: productId } });
  return res.data;
};

export const createVariant = async (data) => {
  const res = await api.post('/variants', data);
  return res.data;
};

export const updateVariant = async (id, data) => {
  const res = await api.put(`/variants/${id}`, data);
  return res.data;
};

export const deleteVariant = async (id) => {
  await api.delete(`/variants/${id}`);
};

// Categories
export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};
