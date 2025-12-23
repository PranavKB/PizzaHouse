import React, { createContext, useContext, useState, type ReactNode, useEffect, useMemo, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (flag: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token) {
      // maybe also verify token validity
      setIsAuthenticated(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    logout
  }), [isAuthenticated, user, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
