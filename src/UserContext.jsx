import { createContext, useState, useEffect, useCallback, useContext } from 'react';

// Create the context with default values
export const UserContext = createContext({
  userInfo: null,
  setUserInfo: () => {},
  loading: true,
  error: null,
  logout: () => {},
  refreshUser: () => {},
});

export function UserContextProvider({ children }) {
  // State management
  const [userInfo, setUserInfo] = useState(() => {
    // Try to get initial user data from sessionStorage
    const savedUser = sessionStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = process.env.REACT_APP_API_URL;

  // Update sessionStorage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      sessionStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  // Fetch user profile function
  const fetchUserProfile = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${api}/profile`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear session if unauthorized
          setUserInfo(null);
          sessionStorage.removeItem('userInfo');
          return;
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserInfo(data);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
      setUserInfo(null);
      sessionStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Check authentication status on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear user data from state and session
      setUserInfo(null);
      sessionStorage.removeItem('userInfo');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user info function
  const updateUserInfo = (data) => {
    setUserInfo(data);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
  };

  // Context value
  const value = {
    userInfo,
    setUserInfo: updateUserInfo,
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

// Custom hook for using the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}