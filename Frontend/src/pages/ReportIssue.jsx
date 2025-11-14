import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ReportIssue = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Road',
    location: {
      address: ''
    }
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm({
        ...form,
        [parent]: {
          ...form[parent],
          [child]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 5 - images.length); // Max 5 images
    
    newImages.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            url: e.target.result,
            file: file,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileSelect = (e) => {
    handleImageUpload(e.target.files);
    e.target.value = ''; // Reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert images to base64 for submission
      const imagePromises = images.map(async (img) => {
        if (img.url.startsWith('data:')) {
          return { url: img.url };
        }
        return { url: img.url }; // In a real app, you'd upload to cloud storage
      });

      const submittedImages = await Promise.all(imagePromises);

      const submitData = {
        ...form,
        images: submittedImages
      };

      await API.post('/issues', submitData);
      alert('Issue reported successfully!');
      navigate('/my-issues');
    } catch (err) {
      console.error('Error reporting issue:', err);
      alert(err.response?.data?.message || 'Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Road', 'Water', 'Electricity', 'Garbage', 'Sanitation', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Report Civic Issue</h1>
            <p className="text-blue-100">Help us make your city better by reporting issues you encounter</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-heading mr-2 text-blue-500"></i>
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Pothole on Main Street, Broken Street Light"
                value={form.title}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Category and Location Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-tag mr-2 text-green-500"></i>
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                  Location Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  placeholder="Street address or landmark"
                  value={form.location.address}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-align-left mr-2 text-purple-500"></i>
                Detailed Description *
              </label>
              <textarea
                name="description"
                placeholder="Provide detailed information about the issue, when you noticed it, and any specific concerns..."
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-vertical"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-images mr-2 text-yellow-500"></i>
                Upload Images (Optional)
                <span className="text-xs text-gray-500 ml-2">Max 5 images, 5MB each</span>
              </label>
              
              {/* Upload Area */}
              <div
                className={`image-upload-container ${dragOver ? 'dragover' : ''} ${
                  images.length > 0 ? 'border-solid bg-gray-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                {images.length === 0 ? (
                  <div>
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                    <p className="text-lg font-semibold text-gray-600 mb-2">
                      Drag & Drop Images Here
                    </p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Choose Files
                    </button>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-check-circle text-3xl text-green-500 mb-3"></i>
                    <p className="text-lg font-semibold text-gray-600 mb-2">
                      {images.length} image{images.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-gray-500">Click to add more or drag & drop</p>
                  </div>
                )}
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="image-preview mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview-item relative group">
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="remove-image opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/my-issues')}
                className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Issues
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-800 transition duration-200 font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Reporting Issue...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Report Issue
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;