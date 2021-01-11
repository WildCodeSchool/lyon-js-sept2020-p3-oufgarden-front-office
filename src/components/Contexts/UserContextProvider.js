import React, { createContext, useState, useEffect } from 'react';
import { getEntity } from '../../services/API';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    getEntity('users').then((data) => setUserDetails(data));
  }, []);
  return (
    <UserContext.Provider value={{ userDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
