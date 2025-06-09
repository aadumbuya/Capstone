import React from 'react';
import { Sprout, CheckCircle, ShoppingCart } from 'lucide-react';
import { FaUser, FaCalendarAlt } from "react-icons/fa"

const CertifiedSeeds = () => {

    const certifiedSeeds = [
        { seedName: 'Hybrid Maize', producer: 'Alfred Divine', dateCertified: '5/8/2025', status: 'Approved' },
        { seedName: 'Rice Paddy', producer: 'Chukwuduzie Akalonu', dateCertified: '5/5/2025', status: 'Approved' },
        { seedName: 'Cowpea', producer: 'Greg Marley', dateCertified: '5/2/2025', status: 'Approved' },
        { seedName: 'Sorghum', producer: 'Amina Yusuf', dateCertified: '4/29/2025', status: 'Approved' },
        { seedName: 'Soybean', producer: 'David Chukwu', dateCertified: '4/25/2025', status: 'Approved' },
        { seedName: 'Hybrid Maize', producer: 'Alfred Divine', dateCertified: '5/8/2025', status: 'Approved' },
        { seedName: 'Rice Paddy', producer: 'Chukwuduzie Akalonu', dateCertified: '5/5/2025', status: 'Approved' },
        { seedName: 'Cowpea', producer: 'Greg Marley', dateCertified: '5/2/2025', status: 'Approved' },
        { seedName: 'Sorghum', producer: 'Amina Yusuf', dateCertified: '4/29/2025', status: 'Approved' },
        { seedName: 'Soybean', producer: 'David Chukwu', dateCertified: '4/25/2025', status: 'Approved' },
    ];   

    return (
        <div className="bg-white rounded-lg shadow p-6 min-h-screen">
            <h2 className="text-xl font-bold mb-4 border-b">Available Certified Seeds</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">                                 
                                    <span>Seed Name</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">                                  
                                    <span>Seed Producer</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">                                  
                                    <span>Date Certified</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">                                  
                                    <span>Status</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">                                   
                                    <span>Action</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {certifiedSeeds.map((seed, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Sprout size={16} className="text-green-500" />
                                        <span>{seed.seedName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    <div className="flex items-center space-x-2">
                                       <FaUser className="text-gray-400 mr-2" />
                                        <span>{seed.producer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarAlt className="text-gray-400 mr-2" />
                                        <span>{seed.dateCertified}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-900">
                                        <CheckCircle size={14} className="mr-1" />
                                        {seed.status.trim()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-xs text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <ShoppingCart size={14} className="mr-2"/>
                                        <span>View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CertifiedSeeds;