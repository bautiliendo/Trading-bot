import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [bearer, setBearer] = useState('');

  return (
    <AuthContext.Provider value={{ bearer, setBearer }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
