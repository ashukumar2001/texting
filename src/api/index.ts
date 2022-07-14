import { Store } from "@reduxjs/toolkit";
import axios from "axios";

export const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const axiosInstance = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
});

let store: Store;
export const indjectStore = (_store: Store) => {
  store = _store;
};

axiosInstance.interceptors.request.use(
  (config) => {
    console.log({ store });

    // Add access token here
    return config;
  },
  (error) => {
    // get new access token if there login error
    return Promise.reject(error);
  }
);

export default axiosInstance;
