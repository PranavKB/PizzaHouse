// src/context/ItemsContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ItemDTO } from '../types/interfaces';
import { getItemsDTO } from '../services/itemService';
import { useAuth } from './AuthContext';
import LoadingModal from '../components/LoadingModal/LoadingModal';

interface ItemsContextType {
  items: ItemDTO[];
  setItems: React.Dispatch<React.SetStateAction<ItemDTO[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  refreshItems: () => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItemsContext = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  if (!context) throw new Error('useItems must be used within an ItemsProvider');
  return context;
};

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading ...');
  const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItemsDTO();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    } else {
      setItems([]); // clear items on logout
    }
  }, [isAuthenticated]);

  return (
    <ItemsContext.Provider value={{ items, loading, error, refreshItems: fetchItems, setItems, setLoading, setLoadingMessage }}>
      <LoadingModal show={loading} message={loadingMessage} />
      {children}
    </ItemsContext.Provider>
  );
};
