import React, { createContext, useState } from 'react';


//TODO cambiar a : export const AuthContext
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