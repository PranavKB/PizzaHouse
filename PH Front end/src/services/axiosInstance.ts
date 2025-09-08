import axios from "axios";
import type {  AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_BASE } from "../config/apiConfig";
import showNotification from "../components/Notification/showNotification";


const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE, 
  withCredentials: true, // Needed for cookies, optional if using tokens
});

//  Request Interceptor - Attaching Authorization token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.email) {
          config.headers["email"] = user.email;
        }
      } catch (e) {
        console.warn("Invalid user JSON in localStorage");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Response Interceptor - Handling global errors 
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
     
      console.warn("Unauthorized: Redirecting to login.");
      showNotification.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
