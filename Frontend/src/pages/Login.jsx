import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/report');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      // This would typically call a backend endpoint to send reset email
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setForgotPasswordMessage(`Password reset instructions have been sent to ${forgotPasswordEmail}`);
      setForgotPasswordEmail('');
      
      // Hide the modal after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage('');
      }, 3000);
    } catch (err) {
      setForgotPasswordMessage('Failed to send reset instructions. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setForm({ email: 'admin@citycare.com', password: 'admin123' });
    } else {
      setForm({ email: 'citizen@citycare.com', password: 'citizen123' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-blue-100">Login to your CityCare account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fas fa-envelope mr-2 text-green-500"></i>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fas fa-lock mr-2 text-red-500"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
              >
                <i className="fas fa-key mr-1"></i>
                Forgot your password?
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-800 transition duration-200 font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login to Account
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="px-6 pb-4">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-sm text-gray-600 mb-3">
                Quick Login with Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => fillDemoCredentials('admin')}
                  className="bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition duration-200 text-sm font-semibold"
                >
                  <i className="fas fa-user-shield mr-1"></i>
                  Admin
                </button>
                <button
                  onClick={() => fillDemoCredentials('citizen')}
                  className="bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition duration-200 text-sm font-semibold"
                >
                  <i className="fas fa-user mr-1"></i>
                  Citizen
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-key mr-2 text-blue-500"></i>
                Reset Your Password
              </h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {forgotPasswordMessage ? (
              <div className="text-center py-4">
                <i className="fas fa-check-circle text-3xl text-green-500 mb-3"></i>
                <p className="text-green-600 font-medium">{forgotPasswordMessage}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordMessage('');
                      }}
                      className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50"
                    >
                      {forgotPasswordLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Instructions
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;