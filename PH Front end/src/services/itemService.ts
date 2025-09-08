
import type { Item, ItemDTO, UserType } from '../types/interfaces';
import axiosInstance from './axiosInstance';


export const getItems = async (): Promise<Item[]> => {
  try {
    const response = await axiosInstance.get<Item[]>("/items/all");
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    console.error("Failed to fetch items:", error);
    const ans:Item[] = [];
    return ans;
  }
};

export const getItemsDTO = async (): Promise<ItemDTO[]> => {
  try {
    const response = await axiosInstance.get<ItemDTO[]>("/items/all");
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    console.error("Failed to fetch items:", error);
    const ans:ItemDTO[] = [];
    return ans;
  }
};

export const getUserTypes = async (): Promise<UserType[]> => {
  try {
    const response = await axiosInstance.get<UserType[]>("/user/userTypes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user types:", error);
    const ans:UserType[] = [];
    return ans;
  }
};
 
