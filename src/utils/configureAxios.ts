/* eslint-disable */
import axios from "axios";
import { getCookie } from "../helper/getCookie";
import { RouteName } from "../constants/routes";
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

apiClient.interceptors.request.use(
  (request) => {
    let accessToken = getCookie("token");
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let accessToken = getCookie('token');
    if (
      error?.response?.status === 401 &&
      accessToken !== '' &&
      accessToken !== undefined
    ) {
      const change = new Date(0).toUTCString();

      document.cookie = `token=;expires=${change};path=/`;
      document.cookie = `fullName=;expires=${change};path=/`;
      document.cookie = `email=;expires=${change};path=/`;
      document.cookie = `role=;expires=${change};path=/`;
      window.location.href = RouteName.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
