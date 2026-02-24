import api from '../api/axiosInstance';

export const create = async (data) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders/mine');
  return res.data;
};

export const getById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const getAll = async (params = {}) => {
  const res = await api.get('/orders', { params });
  return res.data;
};

export const updateStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};
