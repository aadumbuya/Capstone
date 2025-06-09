import React, { useEffect, useState } from 'react';
import { useSeedStore } from '../../store/slices/seed-slice';
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { Sprout, CheckCircle, NotepadText, Save } from 'lucide-react';

const ProducerSeeds = () => {
  const { fetchUserSeedReports, updateSeedReport, seedReports, isLoading, error } = useSeedStore();
  const [selectedSeedId, setSelectedSeedId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [formData, setFormData] = useState({
    seed_name: '',
    seed_variety: '',
    quantity: '',
    weight_per_1000_seed: '',
    region_state: '',
    farm_address: '',
    harvest_date: '',
    additional_information: '',
    status: 'SAVED'
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      loadSeedReports(username);
    }
  }, []);

  const loadSeedReports = async (username) => {
    try {
      await fetchUserSeedReports(username);
    } catch (error) {
      toast.error("Failed to load seed reports");
      console.error('Error loading seed reports:', error);
    }
  };

  const handleViewDetails = (seedId) => {
    setSelectedSeedId(seedId);
    setShowDetailsModal(true);
    
    const selectedSeed = seedReports.find(seed => seed.seed_id === seedId);
    if (selectedSeed) {
      setFormData({
        seed_name: selectedSeed.seed_report.seed_details.seed_name || '',
        seed_variety: selectedSeed.seed_report.seed_details.seed_variety || '',
        quantity: selectedSeed.seed_report.seed_details.quantity || '',
        weight_per_1000_seed: selectedSeed.seed_report.seed_details.weight_per_1000_seed || '',
        region_state: selectedSeed.seed_report.seed_details.region_state || '',
        farm_address: selectedSeed.seed_report.seed_details.farm_address || '',
        harvest_date: selectedSeed.seed_report.seed_details.harvest_date || '',
        additional_information: selectedSeed.seed_report.seed_details.additional_information || '',
        status: selectedSeed.status || 'SAVED'
      });
    }
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedSeedId(null);
  };

  const getSelectedSeed = () => {
    return seedReports.find(seed => seed.seed_id === selectedSeedId);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
  };


  const handleSaveChanges = async () => {
    const seedDetails = {
      seed_name: formData.seed_name,
      seed_variety: formData.seed_variety,
      quantity: formData.quantity,
      weight_per_1000_seed: formData.weight_per_1000_seed,
      region_state: formData.region_state,
      farm_address: formData.farm_address,
      harvest_date: formData.harvest_date,
      additional_information: formData.additional_information
    };

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        toast.error('Username not found');
        return;
      }
      await updateSeedReport(username, selectedSeedId, { seed_details: seedDetails });
      toast.success('Seed report updated successfully');
    } catch (error) {
      toast.error('Failed to update seed report');
      console.error('Update error:', error);
    }
  };


  const handleSubmitToInspector = () => {
    setShowConfirmModal(true);
  };


  const confirmSubmission = async () => {
    const seedDetails = {
      seed_name: formData.seed_name,
      seed_variety: formData.seed_variety,
      quantity: formData.quantity,
      weight_per_1000_seed: formData.weight_per_1000_seed,
      region_state: formData.region_state,
      farm_address: formData.farm_address,
      harvest_date: formData.harvest_date,
      additional_information: formData.additional_information
    };

    const submissionData = {
      seed_details: seedDetails,
      status: formData.status 
    };

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        toast.error('Username not found');
        return;
      }
      await updateSeedReport(username, selectedSeedId, submissionData);
      toast.success('Seed report submitted to inspector successfully');
      setShowConfirmModal(false);
      closeModal();
    } catch (error) {
      toast.error('Failed to submit seed report');
      console.error('Submission error:', error);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmModal(false);
  };

  const isReadOnly = formData.status !== 'saved';

  if (isLoading && (!seedReports || seedReports.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-bounce mx-auto mb-3">
            <Sprout size={48} className="text-green-600" strokeWidth={1.5} />
          </div>
          <p className="mt-2 text-gray-600">Growing your seed reports...</p>
        </div>
      </div>
    );
  }

  if (error && (!seedReports || seedReports.length === 0)) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => loadSeedReports(localStorage.getItem('username'))}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Seed Reports</h1>
      
      {!seedReports || seedReports.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No seed reports found</h3>
          <p className="mt-1 text-gray-500">Submit your first seed certification application to get started.</p>
          <div className="mt-6">
            <Link to="/dashboard/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Submit New Application
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto text-center">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Number
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Seed Name
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Variety
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-3 py-3 text-sm font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seedReports.map((seed, index) => (
                  <tr key={seed.seed_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{seed.seed_report.seed_details.seed_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seed.seed_report.seed_details.seed_variety}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seed.seed_report.seed_details.quantity} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                      <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-xs ${
                        seed.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        seed.status === 'INSPECTOR' ? 'bg-blue-100 text-blue-800' : 
                        seed.status === 'AGENCY' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {seed.status === 'APPROVED' && <CheckCircle size={14} className="mr-1" />}
                        {seed.status === 'INSPECTOR' && <NotepadText size={14} className="mr-1" />}
                        {seed.status === 'AGENCY' && <Save size={14} className="mr-1" />}
                        {seed.status === 'saved' && <Save size={14} className="mr-1" />}
                        {seed.status }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(seed.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(seed.seed_id)}
                        className="text-white px-2 py-1 bg-green-600 mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-xs z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xs shadow-xl w-full max-w-md mx-4 animate-fadeIn">
            <div className="bg-green-500 text-white px-6 py-4 rounded-t-xs">
              <h3 className="text-lg font-bold">Confirm Submission</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to submit this seed report to the inspector? Once submitted, you will no longer be able to edit the details.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelSubmission}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmission}
                  className="px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-600"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seed Details Modal */}
      {showDetailsModal && selectedSeedId && (
        <div className="fixed inset-0 backdrop-blur-xs z-30 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xs shadow-xl w-full max-w-4xl mx-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-xs flex justify-between items-center">
              <h2 className="text-xl font-bold">Seed Report Details</h2>
              <button 
                onClick={closeModal} 
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {getSelectedSeed() && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seed Name</label>
                        <input
                          type="text"
                          value={formData.seed_name}
                          onChange={(e) => handleInputChange('seed_name', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                        <input
                          type="text"
                          value={formData.seed_variety}
                          onChange={(e) => handleInputChange('seed_variety', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight per 1000 seeds (g)</label>
                        <input
                          type="number"
                          value={formData.weight_per_1000_seed}
                          onChange={(e) => handleInputChange('weight_per_1000_seed', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                        <input
                          type="text"
                          value={formData.region_state}
                          onChange={(e) => handleInputChange('region_state', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address</label>
                        <textarea
                          value={formData.farm_address}
                          onChange={(e) => handleInputChange('farm_address', e.target.value)}
                          disabled={isReadOnly}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                        <input
                          type="date"
                          value={formData.harvest_date}
                          onChange={(e) => handleInputChange('harvest_date', e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                    <textarea
                      value={formData.additional_information}
                      onChange={(e) => handleInputChange('additional_information', e.target.value)}
                      disabled={isReadOnly}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter any additional information about the seed..."
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700">STATUS:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isReadOnly}
                    className="px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="SAVED">SAVED</option>
                    <option value="INSPECTOR">INSPECTOR</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300"
                  >
                    Close
                  </button>
                  
                  {formData.status === 'SAVED' && (
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-xs hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  )}
                  
                  {formData.status === 'INSPECTOR' && (
                    <button
                      onClick={handleSubmitToInspector}
                      className="px-4 py-2 bg-green-600 text-white rounded-xs hover:bg-green-700"
                    >
                      Submit to Inspector
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerSeeds;