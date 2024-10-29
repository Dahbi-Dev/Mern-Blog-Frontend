import "./App.css";
import AllPosts from "./Components/AllPosts";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Layout from "./Components/layout";
import RegisterPage from "./Components/login/register";
import LoginPage from "./Components/login/login";
import { UserContextProvider, useUser } from "./UserContext";
import Create from "./Components/Actions/Create";
import Update from "./Components/Actions/Edit";
import PostPage from "./Components/PostPage";
import Edit from "./Components/Actions/Edit";
import CookieConsentModal from "./Components/CookieConsentModal";
import { useEffect } from "react";
import AdminDashboard from "./Admin/AdminDashboard";

// Route guard component for authenticated redirection
function AuthRedirect({ children }) {
  const { userInfo } = useUser();
  const location = useLocation();

  // Redirect to '/' if user is logged in and trying to access '/login' or '/register'
  if (
    userInfo &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return null; // Do nothing, prevent navigation
  }

  return children;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AllPosts />} />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterPage />
                </AuthRedirect>
              }
            />
            <Route path="/create" element={<Create />} />
            <Route path="/update" element={<Update />} />
            <Route path="/postPage/:id" element={<PostPage />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/edit/:id" element={<Edit />} />

            {/* Redirect unknown routes to '/' */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <CookieConsentModal />
      </UserContextProvider>
    </div>
  );
}
