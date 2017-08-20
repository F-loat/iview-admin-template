import axios from 'axios';
import iView from 'iview';

const request = axios.create({
  baseURL: '/api',
});

request.interceptors.request.use((config) => {
  const newConfig = config;
  const token = sessionStorage.token;
  if (token) {
    newConfig.headers = { Authorization: `Bearer ${token}` };
  }
  return newConfig;
}, (err) => {
  iView.Message.error(err.message);
});

request.interceptors.response.use((res = {}) => {
  const msg = res.data && res.data.msg;
  if (msg) {
    iView.Message.error(msg);
    return false;
  }
  const token = res.headers['set-authorization'];
  if (token) sessionStorage.setItem('token', token);
  return res.data || true;
}, (err) => {
  const res = err.response;
  const { msg } = res && res.data;
  const isAuthErr = res.status === 401;
  if (isAuthErr) sessionStorage.removeItem('token');
  iView.Message.error(msg || err.message);
  return false;
});

export default request;
