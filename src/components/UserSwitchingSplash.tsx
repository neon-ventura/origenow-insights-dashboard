import React from 'react';
import { LoadingSplash } from './LoadingSplash';
import { useAuth } from '@/contexts/AuthContext';

export const UserSwitchingSplash = () => {
  const { isSwitchingUser, currentUser } = useAuth();

  if (!isSwitchingUser) {
    return null;
  }

  return (
    <LoadingSplash 
      message={`Alternando para a conta de ${currentUser?.nickname || currentUser?.user || 'usuário'}...`}
      size="lg" 
      overlay 
    />
  );
};