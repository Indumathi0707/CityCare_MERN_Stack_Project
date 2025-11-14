import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    wardNumber: '',
    role: 'citizen',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminConfig, setAdminConfig] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminConfig();
  }, []);

  const fetchAdminConfig = async () => {
    try {
      const { data } = await API.get('/auth/config');
      setAdminConfig(data);
    } catch (err) {
      console.error('Failed to fetch admin config');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (role) => {
    setForm({ 
      ...form, 
      role,
      adminCode: '', // Reset admin code when role changes
      wardNumber: role === 'admin' ? '' : form.wardNumber 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/report');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdminCodeVisibility = () => {
    setShowAdminCode(!showAdminCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Join CityCare</h2>
            <p className="text-blue-100">Choose your role and create your account</p>
          </div>

          {/* Role Selection */}
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              <i className="fas fa-user-tag mr-2 text-blue-500"></i>
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('citizen')}
                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  form.role === 'citizen'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-blue-300'
                }`}
              >
                <i className="fas fa-user text-2xl mb-2"></i>
                <div className="font-semibold">Citizen</div>
                <div className="text-xs mt-1">Report Issues</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  form.role === 'admin'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-purple-300'
                }`}
              >
                <i className="fas fa-user-shield text-2xl mb-2"></i>
                <div className="font-semibold">Admin</div>
                <div className="text-xs mt-1">Manage Issues</div>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fas fa-user mr-2 text-blue-500"></i>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fas fa-envelope mr-2 text-green-500"></i>
                Email Address *
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
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  minLength="6"
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

            {/* Citizen-specific field */}
            {form.role === 'citizen' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <i className="fas fa-map-marker-alt mr-2 text-orange-500"></i>
                  Ward Number *
                </label>
                <input
                  type="text"
                  name="wardNumber"
                  placeholder="Enter your ward number (e.g., Ward 12)"
                  value={form.wardNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us assign your issues to the correct local authority
                </p>
              </div>
            )}

            {/* Admin-specific field */}
            {form.role === 'admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <i className="fas fa-key mr-2 text-purple-500"></i>
                  Admin Registration Code *
                </label>
                <div className="relative">
                  <input
                    type={showAdminCode ? "text" : "password"}
                    name="adminCode"
                    placeholder="Enter admin registration code"
                    value={form.adminCode}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleAdminCodeVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    <i className={`fas ${showAdminCode ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contact system administrator to get the admin registration code
                </p>
              </div>
            )}

            {/* Role Information */}
            <div className={`p-4 rounded-lg ${
              form.role === 'citizen' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
            }`}>
              <div className="flex items-start">
                <i className={`fas ${
                  form.role === 'citizen' ? 'fa-info-circle text-blue-500' : 'fa-shield-alt text-purple-500'
                } mt-1 mr-3`}></i>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {form.role === 'citizen' ? 'Citizen Account' : 'Admin Account'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {form.role === 'citizen' 
                      ? 'As a citizen, you can report civic issues in your area and track their resolution status.'
                      : 'As an admin, you can manage all reported issues, update their status, and assign them to team members.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition duration-200 ${
                form.role === 'citizen'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating {form.role === 'citizen' ? 'Citizen' : 'Admin'} Account...
                </>
              ) : (
                <>
                  <i className={`fas ${form.role === 'citizen' ? 'fa-user-plus' : 'fa-user-shield'} mr-2`}></i>
                  Register as {form.role === 'citizen' ? 'Citizen' : 'Admin'}
                </>
              )}
            </button>
          </form>
          
          <div className="px-6 pb-6">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;