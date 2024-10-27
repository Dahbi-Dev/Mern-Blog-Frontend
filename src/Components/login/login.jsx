import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { Loader2, MailIcon, KeyIcon, AlertCircle } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
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

  const login = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${api}/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
        navigate('/');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Register here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={login}>
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
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
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>


          <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Forgot your password?
          </button>
        </div>


          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Sign in'
            )}
          </button>

       
        </form>
        {/* Close the form here */}
      
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      </div>
    </div>
  );
}