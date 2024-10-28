import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

export const UserContext = createContext({
  userInfo: null,
  setUserInfo: () => {},
  loading: true,
  error: null,
  logout: () => {},
  refreshUser: () => {},
});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = sessionStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (userInfo) {
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      sessionStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  const fetchUserProfile = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${api}/profile`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUserInfo(null);
          sessionStorage.removeItem("userInfo");
        } else if (response.status === 404) {
          // Handle 404 (Not Found) case
          setUserInfo(null);
          sessionStorage.removeItem("userInfo");
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } else {
        const data = await response.json();
        setUserInfo(data);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (err) {
      setError(err.message);
      setUserInfo(null);
      sessionStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (!userInfo) {
      fetchUserProfile();
    }
  }, [userInfo, fetchUserProfile]);

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUserInfo(null);
      sessionStorage.removeItem("userInfo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (data) => {
    try {
      // Optimistic update
      setUserInfo(data);
      sessionStorage.setItem("userInfo", JSON.stringify(data));

      const response = await fetch(`${api}/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }
    } catch (err) {
      // Revert state to previous value on error
      setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")));
      setError(err.message);
    }
  };

  const value = {
    userInfo,
    setUserInfo: updateUserInfo,
    loading,
    error,
    logout,
    refreshUser: fetchUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
