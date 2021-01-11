import React, { useState, useEffect } from 'react';
import { getCollection } from '../services/API';

export const UserContext = React.createContext();
export function UserContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    getCollection('user').then((data) => setUserDetails(data));
  }, []);

  return (
    <UserContext.Provider value={{ userDetails }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
