import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);

 

  return (
    <authContext.Provider value={{ user, setuser, loading, setloading }}>
      {children}
    </authContext.Provider>
  );
};
