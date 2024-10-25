// UserContext.js
import { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API_URL;

  const fetchUserProfile = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${api}/profile`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUserInfo(null);
          return;
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError(err.message);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/logout`, {
        credentials: 'include',
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUserInfo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userInfo,
    setUserInfo,
    loading,
    error,
    logout,
    refreshUser: fetchUserProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
