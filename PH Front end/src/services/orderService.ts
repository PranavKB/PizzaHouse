

import showNotification from "../components/Notification/showNotification";
import axiosInstance from "./axiosInstance";

const storedEmail = localStorage.getItem('email');
//const user: user | null = storedUser ? JSON.parse(storedUser) as user : null;

const headers: Record<string, string> = {};

if (storedEmail) {
  headers["email"] = storedEmail;
}

export const placeOrder = async (
  order: Record<number, number>, 
  orderStatus: number = 1
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/orders/newOrder", order, {
      params: { orderStatus },
      headers,
      withCredentials: true, 
    });

    return response.data;
  } catch (error: any) {
    console.error("Error placing order:", error.response?.data || error.message);
    throw error;
  }
};

export const getOrderHistory = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/orders/history", {
      headers,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching order history:", error.response?.data || error.message);
    throw error;
  }
};

export const confirmOrderCall = async (orderId: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/orders/${orderId}/confirm`, {}, {
      headers,
      withCredentials: true,
    });
    showNotification.success("Order confirmed successfully!");
    return response.data;
  } catch (error: any) {
    console.error("Error confirming order:", error.response?.data || error.message);
    throw error;
  }
};

export const getCartByOrderId = async (orderId: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/orders/map/${orderId}`, {
      headers,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching cart:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserCart = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/orders/map`, {
      headers,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching cart:", error.response?.data || error.message);
    throw error;
  }
};

export const clearCartApi = async (): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/orders/map`, {
      headers,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error clearing cart:", error.response?.data || error.message);
    throw error;
  }
};
