import React, { useState } from 'react';
import { FaLeaf, FaWeightHanging, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import { useSeedStore } from '../../store/slices/seed-slice';

const SeedSubmision = () => {
  const { submitSeedReport } = useSeedStore();
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [isSubmitting, setIsSubmitting] = useState();
  const [formData, setFormData] = useState({
    seedName: '',
    seedVariety: '',
    quantity: '',
    weight: '',
    harvestDate: '',
    region: '',
    farmAddress: '',
    additionalInfo: '',
    seedImage: null
  });  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      seedImage: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const username = localStorage.getItem('username');
      const payload = {
        username: username,
        data: {
          seed_details:{
            seed_name: formData.seedName,
            seed_variety: formData.seedVariety,
            region_state: formData.region,
            harvest_date: formData.harvestDate,
            farm_address: formData.farmAddress,
            quantity: formData.quantity,
            weight_per_1000_seed: formData.weight,
            additional_information: formData.additionalInfo
          },
          status: "saved"
        }
      }
      await submitSeedReport(payload);
      toast.success("Submission Successful")
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Submission Failed")
      console.error('Failed to submit seed certification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setFormData({
      seedName: '',
      seedVariety: '',
      quantity: '',
      weight: '',
      harvestDate: '',
      region: '',
      farmAddress: '',
      additionalInfo: '',
      seedImage: null
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
     <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>   
      <div className="w-full bg-white">
        <div className=" p-6">
          <h1 className="text-xl font-bold">Seed Certification Application</h1>
        </div>        
        <div className="flex flex-col md:flex-row flex-grow md:px-[4rem]">
          <div className="w-full md:w-1/3 p-6 border-gray-200">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-lg w-64 h-64 mb-6 border-2 border-dashed border-gray-300 relative">
                {formData.seedImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <img 
                      src={URL.createObjectURL(formData.seedImage)} 
                      alt="Seed preview" 
                      className="max-w-full max-h-full object-contain" 
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, seedImage: null }))}
                      className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaLeaf className="text-green-600 text-5xl mb-2" />
                    <p className="text-gray-500 mb-2">Upload seed image</p>
                    <label className="cursor-pointer bg-green-600 text-white py-2 px-4 rounded-xs hover:bg-green-700 transition-colors inline-block">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
              
              <div className="w-full mb-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaInfoCircle className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please upload a clear image of your seed sample. This helps our inspectors identify and evaluate the seed quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Application Process</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>Fill out this application form</li>
                  <li>Our team will review your submission</li>
                  <li>Schedule an on-site inspection</li>
                  <li>Laboratory testing of seed samples</li>
                  <li>Certification issued if all standards are met</li>
                </ol>
              </div>
            </div>
          </div>
          

          <div className="w-full md:w-2/3 p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                Seed Information
              </h2>              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="seedName" className="block text-sm font-medium text-gray-700 mb-1">
                    Seed Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLeaf className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="seedName"
                      name="seedName"
                      value={formData.seedName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      placeholder="e.g., Maize, Rice, Soybean"
                    />
                  </div>
                </div>
                
           
                <div>
                  <label htmlFor="seedVariety" className="block text-sm font-medium text-gray-700 mb-1">
                    Seed Variety
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLeaf className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="seedVariety"
                      name="seedVariety"
                      value={formData.seedVariety}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      placeholder="e.g., SAMMAZ 15, FARO 44"
                    />
                  </div>
                </div>
                
        
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg)*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWeightHanging className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      placeholder="Total quantity in kg"
                    />
                  </div>
                </div>
                
           
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight per 1000 seeds (g)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWeightHanging className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Harvest Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="harvestDate"
                      name="harvestDate"
                      value={formData.harvestDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                   Region
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="city_state_country"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="farmAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="farmAddress"
                      name="farmAddress"
                      value={formData.farmAddress}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      placeholder="Enter complete farm address where seeds were grown"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows="4"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Any additional details about your seeds (growing conditions, fertilizers applied, etc.)"
                  ></textarea>
                </div>
              </div>
              
              {/* Form buttons */}
              <div className="flex justify-end pt-8">                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xs bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-xs z-50 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white rounded-xs shadow-xl w-full max-w-md mx-4 animate-fadeIn border border-green-200">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-xs flex justify-between items-center">
              <h2 className="text-xl font-bold">Application Submitted!</h2>
              <button 
                onClick={closeModal} 
                className="text-white hover:text-gray-200 focus:outline-none transition-transform hover:rotate-90 duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <p className="text-center text-gray-700 mb-2">Your seed certification application has been submitted successfully!</p>
              
              <div className="bg-gray-50 p-3 rounded-xs border border-gray-200 mb-4">
                <p className="text-sm text-gray-600">An Inspector will review your application, check within 3-5 business days on your seed certifications .</p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedSubmision;