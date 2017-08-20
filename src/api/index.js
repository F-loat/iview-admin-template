import { request } from '@/utils';

const uploadFile = params => request.post('/files', params);
const createToken = params => request.post('/tokens', params);
const indexUser = params => request.get('/users', { params });
const showUser = (id, params) => request.get(`/users/${id}`, { params });
const editUser = (id, params) => request.patch(`/users/${id}`, { params });
const createUserTag = params => request.post('/users/tags', params);
const removeUserTag = (id, params) => request.delete(`/users/tags/${id}`, { params });

export {
  uploadFile,
  createToken,
  indexUser,
  showUser,
  editUser,
  createUserTag,
  removeUserTag,
};
