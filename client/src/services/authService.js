import api from '../api/axiosInstance';

export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateMe = async (data) => {
  const res = await api.put('/users/me', data);
  return res.data;
};

export const getAddresses = async () => {
  const res = await api.get('/users/me/addresses');
  return res.data;
};

export const createAddress = async (data) => {
  const res = await api.post('/users/me/addresses', data);
  return res.data;
};
