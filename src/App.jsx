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

  // If user is logged in, redirect to '/' when accessing '/login' or '/register'
  if (userInfo && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Wildcard route guard for handling unknown paths
function UnknownRouteRedirect() {
  const { pathname } = useLocation();
  const { userInfo } = useUser();

  // If on a post page and an unknown route is attempted, stay on the post page
  if (pathname.startsWith("/postPage/")) {
    return null; // Prevent navigation, stay on the post page
  }

  // Redirect all unknown routes to "/"
  return <Navigate to="/" replace />;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

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

            {/* Redirect unknown routes based on the current path */}
            <Route path="*" element={<UnknownRouteRedirect />} />
          </Route>
        </Routes>
        <CookieConsentModal />
      </UserContextProvider>
    </div>
  );
}
