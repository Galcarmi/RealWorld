import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { AuthStore, UserStore } from '../../store';

export const API_URI = 'https://node-express-conduit.appspot.com/api';

const api = axios.create({
  baseURL: API_URI,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = UserStore.user?.token;

  if (token) {
    config.headers.authorization = `Token ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      AuthStore.logout();
    }
    return Promise.reject(error);
  }
);

const responseBody = (res: AxiosResponse) => res.data;

const requests = {
  del: (url: string) => api.delete(url).then(responseBody),
  get: (url: string) => api.get(url).then(responseBody),
  put: <Body>(url: string, body: Body) => api.put(url, body).then(responseBody),
  post: <Body>(url: string, body: Body) =>
    api.post(url, body).then(responseBody),
};

export default requests;
