import "./App.css";
import AllPosts from "./Components/AllPosts";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/layout";
import RegisterPage from "./Components/login/register";
import LoginPage from "./Components/login/login";
import { UserContextProvider } from "./UserContext";
import Create from "./Components/Actions/Create";
import Update from "./Components/Actions/Edit";
import PostPage from "./Components/PostPage";
import Edit from "./Components/Actions/Edit";
import CookieConsentModal from "./Components/CookieConsentModal";
import { useEffect } from "react";
import AdminDashboard from "./Admin/AdminDashboard";

export default function App() {
  useEffect(() => {
    // Theme handling
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AllPosts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<Create />} />
            <Route path="/update" element={<Update />} />
            <Route path="/postPage/:id" element={<PostPage />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Route>
        </Routes>
        <CookieConsentModal />
      </UserContextProvider>
    </div>
  );
}