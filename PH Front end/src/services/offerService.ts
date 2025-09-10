import showNotification from "../components/Notification/showNotification";
import type { Offer, OfferDTO } from "../types/interfaces";
import axiosInstance from "./axiosInstance";


export const getOffersDTO = async (): Promise<OfferDTO[]> => {
  try {
    const response = await axiosInstance.get<OfferDTO[]>('/offers/current');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    showNotification.error('Failed to load offers');
    return [];
  }
};

export const addOffer = async (offer: Omit<OfferDTO, 'id'>): Promise<OfferDTO | null> => {
  try {
    const response = await axiosInstance.post<OfferDTO>('/offers/add', offer);
      showNotification.success('Offer added successfully');
    return response.data; 
  } catch (error) {
    console.error('Failed to add offer:', error);
    showNotification.error('Failed to add offer');
    return null;
  }
};

export const deleteOffer = async (id: number) => {
  try {
    await axiosInstance.delete(`/offers/${id}`);
    showNotification.success('Offer deleted successfully');
  } catch (error) {
    console.error('Failed to delete offer:', error);
    showNotification.error('Failed to delete offer');
  }
};

export const updateOffer = async (id: number, updatedOffer: Offer) => {
  try {
    await axiosInstance.put<OfferDTO>(`/offers/${id}`, updatedOffer);
    showNotification.success('Offer updated successfully');
  } catch (error) {
    console.error("Failed to update offer:", error);
    showNotification.error('Failed to update offer');
  }
};

export const mapItemToOffers = async (itemId: number, offerIds: number[]) => {
  try {
    await axiosInstance.post(`/items/${itemId}/map-offers`, offerIds,
  {
    headers: { 'Content-Type': 'application/json' }
  });
    showNotification.success('Offers mapped to item successfully');
  } catch (error) {
    console.error('Failed to map offers to item:', error);
    showNotification.error('Failed to map offers to item');
  }
};

export const getItemOfferIdMap = async (): Promise<Record<number, number[]>> => {
  try {
    const response = await axiosInstance.get('/items/item-offer-id-map');
    return response.data;
  } catch (error) {
    console.error('Error fetching item-offer map:', error);
    return {};
  }
};


export const formatDateTimeForDB = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDateTimeLocal = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const convertToUIDateTime = (dateTimeLocal: string | undefined): string => {

  const [date, time] = dateTimeLocal ? dateTimeLocal.split('T') : ['', ''];

  const [year, month, day] = date.split('-');

  return `${day}-${month}-${year} ${time}`;
};
