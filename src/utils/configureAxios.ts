/* eslint-disable */
import axios from "axios";
import { getCookie } from "../helper/getCookie";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

apiClient.interceptors.request.use(
  (request) => {
    let accessToken = getCookie("token");
    let collabid = getCookie("collabid");
    if (accessToken) {
      request.headers.collabid = collabid;
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
  (error) => Promise.reject(error)
);

export default apiClient;
