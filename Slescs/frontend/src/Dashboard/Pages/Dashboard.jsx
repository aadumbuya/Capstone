import React from 'react';
import { FaUsers, FaLeaf, FaClipboardCheck, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';
import { useAuthStore } from '../../store/slices/auth-slice';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  const chartData = {
    certified: 65,
    pending: 25,
    rejected: 10
  };
  
  const recentCertifications = [
    { id: 1, seedName: 'Hybrid Maize', farmer: 'John Adebayo', date: '5/8/2025', status: 'Certified' },
    { id: 2, seedName: 'Rice Paddy', farmer: 'Sarah Okafor', date: '5/5/2025', status: 'Pending' },
    { id: 3, seedName: 'Cowpea', farmer: 'Michael Nwosu', date: '5/2/2025', status: 'Certified' },
    { id: 4, seedName: 'Sorghum', farmer: 'Amina Yusuf', date: '4/29/2025', status: 'Rejected' },
    { id: 5, seedName: 'Soybean', farmer: 'David Chukwu', date: '4/25/2025', status: 'Certified' },
  ];

  return (
    <div className="w-full p-[2rem]">       
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Farmers</p>
              <h2 className="text-3xl font-bold text-gray-800">128</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaUsers size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Seed Varieties</p>
              <h2 className="text-3xl font-bold text-gray-800">45</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaLeaf size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Certifications</p>
              <h2 className="text-3xl font-bold text-gray-800">93</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaClipboardCheck size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <h2 className="text-3xl font-bold text-gray-800">₦6,000,000</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaMoneyBillWave size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Submissions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seed Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCertifications.map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{cert.seedName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.farmer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cert.status === 'Certified' 
                          ? 'bg-green-100 text-green-800' 
                          : cert.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seed Certification Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-20 border-green-500" style={{ clipPath: `polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 0 0)` }}></div>
              <div className="absolute inset-0 rounded-full border-20 border-yellow-400" style={{ clipPath: `polygon(50% 50%, 100% 0, 100% 25%, 100% 50%, 75% 50%)` }}></div>
              <div className="absolute inset-0 rounded-full border-20 border-red-400" style={{ clipPath: `polygon(50% 50%, 100% 50%, 100% 75%, 100% 100%, 75% 100%)` }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaChartPie className="text-gray-300" size={32} />
              </div>
            </div>
            
            <div className="ml-8">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Certified ({chartData.certified}%)</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
                <span className="text-sm text-gray-600">Pending ({chartData.pending}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 mr-2"></div>
                <span className="text-sm text-gray-600">Rejected ({chartData.rejected}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {[
            { action: 'Certified Maize Seeds', user: 'Inspector Ahmed', time: '2 hours ago' },
            { action: 'New Seed Submission', user: 'Farmer Okonkwo', time: '5 hours ago' },
            { action: 'Updated Certification Standards', user: 'Agency Admin', time: '1 day ago' },
            { action: 'New Distributor Registration', user: 'Greenfield Distributors', time: '2 days ago' },
            { action: 'Seed Quality Inspection', user: 'Inspector Sarah', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                {index + 1}
              </div>
              <div>
                <p className="text-gray-800 font-medium">{activity.action}</p>
                <p className="text-gray-500 text-sm">By {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;