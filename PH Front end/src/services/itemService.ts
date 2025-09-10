
import showNotification from '../components/Notification/showNotification';
import type { Item, ItemDTO, ItemTypeProps, UserType } from '../types/interfaces';
import axiosInstance from './axiosInstance';

interface AddItemDTO {
  itemName: string;
  itemTypeName: string;
  itemPrice: number;
  isVeg: number; // 0 or 1
  description: string;
  imageUrl: string;
}

interface AddedItemResponse {
  addedItem: ItemDTO;
  message: string;
}

export const convertToJPG = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      if (!e.target?.result) return reject("Failed to read file.");
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error.");

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("JPEG blob creation failed.");
          const jpgFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
            type: "image/jpeg",
          });
          resolve(jpgFile);
        },
        "image/jpeg",
        0.85 // compression quality
      );
    };

    reader.onerror = reject;
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
};


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

export const addItem = async (item: Omit<ItemDTO, 'id'>): Promise<AddedItemResponse | null> => {
  try {
    const payload: AddItemDTO = {
      ...item,
      isVeg: item.isVeg ? 1 : 0,
      imageUrl: item.imageUrl,
    };

    const response = await axiosInstance.post("/items/add", payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add item:", error);
    return null;
  }
};

export const getItemTypes = async (): Promise<ItemTypeProps[]> => {
  try {
    const response = await axiosInstance.get<ItemTypeProps[]>('/items/item-types');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch item types:", error);
    return [];
  }
};

export const uploadImage = async (formData: FormData): Promise<string | null> => {
  try {
    const response = await axiosInstance.post("/image/item/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload image:", error);
    showNotification.error("Image upload failed.");
    return null;
  }
};

export const getImage = async (imagePath: string): Promise<string | null> => {
  try {
    const response = await axiosInstance.get(`/${imagePath}`, {
      responseType: "blob", // Fetch the image as binary data
    });

    // Convert Blob to an object URL for <img src="...">
    const url = URL.createObjectURL(response.data);
    return url;
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return null;
  }
};

