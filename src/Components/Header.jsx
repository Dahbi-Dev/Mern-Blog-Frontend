import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  Menu,
  X,
  LogOut,
  Plus,
  Loader2,
  Moon,
  Sun,
  AlertTriangle,
  User,
  Settings,
  UserCog,
} from "lucide-react";

const Header = () => {
  const { userInfo, logout, loading } = useContext(UserContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowLogoutDialog(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const username = userInfo?.username;
  const isAdmin = userInfo?.isAdmin;
  const profileImage = userInfo?.profileImage;

  return (
    <>
      <header
        ref={headerRef}
        className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-40 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="text-2xl font-bold text-orange-500 hover:text-orange-600 dark:text-orange-400"
            >
              BlogStack
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 md:hidden rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {loading ? (
                <span className="text-gray-500 dark:text-gray-400">
                  <Loader2 className="animate-spin" size={20} />
                </span>
              ) : username ? (
                <>
                  <span className="text-gray-600 dark:text-gray-300">
                    Welcome, {username}!
                  </span>
                  <Link
                    to="/create"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    <Plus size={18} />
                    Create new post
                  </Link>
                  
                  {/* Profile Menu */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                    
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                        <Link
                          to="/profile"
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={handleLinkClick}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <UserCog size={16} />
                            Admin Panel
                          </Link>
                        )}
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden pb-4">
              {loading ? (
                <span className="block text-gray-500 dark:text-gray-400 px-4 py-2">
                  <Loader2 className="animate-spin" size={20} />
                </span>
              ) : username ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-600 dark:text-gray-300">
                      Welcome, {username}!
                    </span>
                  </div>
                  <Link
                    to="/create"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    <Plus size={18} />
                    Create new post
                  </Link>
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                    >
                      <UserCog size={18} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 w-full px-4 py-2 text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={dialogRef}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-semibold">Confirm Logout</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Logging out...</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;