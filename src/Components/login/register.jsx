import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, UserIcon, KeyIcon, AlertCircle, MailIcon } from 'lucide-react';
import { UserContext } from '../../UserContext';

export default function RegisterPage() {
  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (formData.username.length < 4) {
      setError('Username must be at least 4 characters long');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const performLogin = async (credentials) => {
    const response = await fetch(`${api}/login`, {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setUserInfo(data);
    return data;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const registerRes = await fetch(`${api}/register`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        await performLogin(formData);
        navigate('/');
      } else {
        // Check if error is due to existing user
        if (registerRes.status === 409 || registerData.message?.toLowerCase().includes('already exists')) {
          try {
            // Attempt to login with provided credentials
            await performLogin(formData);
            navigate('/');
          } catch (loginErr) {
            setError('Account exists but password is incorrect. Please try logging in instead.');
          }
        } else {
          setError(registerData.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={register}>
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="Username (min. 4 characters)"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="Password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}