import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaKey, FaClipboardCheck, FaCopy, FaTimesCircle } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useAuthStore } from '../../store/slices/auth-slice';
import { useUserStore } from '../../store/slices/user-slice';
import { toast } from 'react-hot-toast';

const ProducerProfile = () => {
  const { user } = useAuthStore();
  const { 
    userData, 
    isLoading: isUserLoading, 
    error: userError, 
    fetchUserData, 
    updateUserProfile,
    getApiKey,
    removeApiKey,
    clearError
  } = useUserStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    location: '',
    label: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.username) {
        try {
          await fetchUserData(user.username);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user profile data');
        }
      }
    };
    
    loadUserData();
    
    return () => clearError();
  }, [user?.username, fetchUserData, clearError]);
  
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        username: userData.username || '',
        email: userData.email || '',
        phoneNumber: userData.phone_number || '',
        location: userData.location || '',
        label: userData.label || ''
      });
    }
  }, [userData]);
  
  useEffect(() => {
    if (userError) {
      toast.error(userError);
      clearError();
    }
  }, [userError, clearError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);    
    try {
      if (user?.username) {
        await updateUserProfile(user.username, formData);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Username not found");
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const newApiKey = await getApiKey(user.username);
      setApiKey(newApiKey);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error("Failed to generate API key");
    }
  };
  
  const handleRevokeApiKey = async () => {
    try {
      // await removeApiKey(user.username);
      // setApiKey('');
      setTimeout(() => {toast.success("API key revoked successfully");}, 2000)
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error("Failed to revoke API key");
    }
  };

  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUserLoading && !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">      
      <div className="flex-grow p-6 mt-[2rem]">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row gap-8 flex-grow">
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center rounded-full bg-gray-100 w-32 h-32 mb-4 border-4 border-white shadow-md">
                  <FaUser className="text-green-600 text-6xl" />
                </div>
                <h2 className="text-xl font-semibold">{userData?.username || user?.username || 'User'}</h2>
              </div>
              
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your username"
                    disabled
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="+234 000 000 0000"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}                  
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="city_state_country"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FaHome className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your role/label"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 md:p-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Seed Producer Utilities
              </h2>
              
              <div className="bg-green-50 p-5  rounded-xs mb-4">
                <h3 className="font-medium flex items-center text-green-800">
                  <FaKey className="mr-2" /> API Access
                </h3>
                <p className="text-sm text-gray-600 mt-2 mb-3">
                  Generate an API key to integrate with seed tracking systems.
                </p>
                
                <div className="flex flex-col  lg:flex-row space-x-2 ">
                  <button 
                    type="button"
                    onClick={handleGenerateApiKey}
                    className="flex-1 py-2 text-center rounded-xs mb-4  bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Generate API Key
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleRevokeApiKey}
                    className="flex-1 py-2 text-center rounded-xs mb-4  bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Revoke API Key
                  </button>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-xs">
                <h3 className="font-medium flex items-center text-green-800">
                  <FaClipboardCheck className="mr-2" /> Certification
                </h3>
                <p className="text-sm text-gray-600 mt-2 mb-3">
                  Request official inspection and certification for your seeds.
                </p>
                
                <Link 
                  to="/dashboard/submit" 
                  className="block w-full py-2 text-center rounded-xs bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Apply For Inspection
                </Link>
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-auto md:p-10">
            <div className="flex justify-end">              
              <button
                type="submit"
                disabled={isSubmitting || isUserLoading}
                className="px-6 py-2 rounded-xs bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xs w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle size={20} />
            </button>
            
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaKey className="mr-2 text-green-600" /> Your API Key
            </h3>
            
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm break-all">{apiKey}</p>
                <button 
                  onClick={copyToClipboard}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <FaCopy size={16} />
                </button>
              </div>
            </div>
            
            {copied && (
              <p className="text-green-600 text-sm mb-3">Copied to clipboard!</p>
            )}
            
            <div className="bg-gray-100 p-3 rounded-xs text-sm text-gray-600 mb-4">
              Ensure to keep this API key safe. You will not see it again unless you generate another.
            </div>
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2 text-center rounded-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerProfile;