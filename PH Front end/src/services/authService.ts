import axios from 'axios';
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types/authTypes';
import { AUTH_URL } from '../config/apiConfig';


export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${AUTH_URL}/login`, payload);
  console.log('Login response:', response);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<any> => {
  try {
    //if(!payload.userTypeId){payload.userTypeId = 3;}
    const response = await axios.post<any>(`${AUTH_URL}/register`, payload);
    console.log('Register response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error registering user:', error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  await axios.post(`${AUTH_URL}/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true // only needed if you're using cookies
  });
};

export const resetPasswordRequest = async (email: string): Promise<void> => {
  try {
    await axios.post(`${AUTH_URL}/forgot-password`, { email });
  } catch (error: any) {
    console.error('Error requesting password reset:', error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${AUTH_URL}/reset-password`, {
      token,
      newPassword
    });
  } catch (error: any) {
    console.error('Error resetting password:', error.response?.data || error.message);
    throw error;
  }
};
