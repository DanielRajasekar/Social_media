// UserContext.jsx
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../../url";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(`${URL}/api/auth/refetch`, {
        withCredentials: true
      });
      
      if (res.data) {
        setUser(res.data);
        // Store user info in localStorage if needed
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, getUser }}>
      {children}
    </UserContext.Provider>
  );
}
