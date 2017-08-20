const HOST = window.location.host;
const DEV = 'DEV';
const PROD = 'PROD';
const ENV = HOST === '127.0.0.1:8080' ? DEV : PROD;

const BASE_URL = ENV === DEV ? 'http://127.0.0.1:7001' : 'https://prod.com';
const API_URL = `${BASE_URL}/api`;

export default {
  BASE_URL,
  API_URL,
};
