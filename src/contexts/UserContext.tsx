
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedUser {
  nickname: string;
  sellerId: string;
}

interface UserContextType {
  selectedUser: SelectedUser | null;
  setSelectedUser: (user: SelectedUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
