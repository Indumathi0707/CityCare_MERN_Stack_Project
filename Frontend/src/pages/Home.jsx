import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: 'fas fa-bullhorn',
      title: 'Report Issues',
      description: 'Easily report civic issues like potholes, garbage problems, and broken street lights in your area.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'fas fa-tasks',
      title: 'Track Progress',
      description: 'Monitor the status of your reported issues in real-time and get updates on resolution progress.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'fas fa-users',
      title: 'Community Impact',
      description: 'Contribute to making your city cleaner, safer, and better maintained for everyone.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Friendly',
      description: 'Access CityCare from any device - desktop, tablet, or smartphone.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Issues Resolved' },
    { number: '50+', label: 'Wards Covered' },
    { number: '5,000+', label: 'Active Users' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Make Your City
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Better Together
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Report civic issues, track their resolution, and contribute to building a cleaner, safer community with CityCare.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-rocket mr-2"></i>
                Get Started Free
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login to Account
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/report" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Report New Issue
              </Link>
              <Link 
                to="/my-issues" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300"
              >
                <i className="fas fa-list-alt mr-2"></i>
                View My Issues
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How CityCare Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to report issues and make your community better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center card-hover"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl`}>
                  <i className={feature.icon}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Simple 4-Step Process
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Register', desc: 'Create your account', icon: 'fas fa-user-plus' },
                { step: '2', title: 'Report', desc: 'Submit issue with details', icon: 'fas fa-edit' },
                { step: '3', title: 'Track', desc: 'Monitor progress status', icon: 'fas fa-chart-line' },
                { step: '4', title: 'Resolve', desc: 'Issue gets fixed', icon: 'fas fa-check-circle' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      <i className={item.icon}></i>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 -z-10"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of citizens who are actively improving their communities through CityCare.
          </p>
          {!user ? (
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Join CityCare Today
            </Link>
          ) : (
            <Link 
              to="/report" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Report Your First Issue
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;