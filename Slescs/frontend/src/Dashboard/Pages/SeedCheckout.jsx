import React from 'react';
import { FaLeaf, FaWeightHanging, FaCalendarAlt, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';

const SeedCheckout = () => {

    const seedInfo = [
        {
            seedName: 'Hybrid Maize',
            seedVariety: 'SAMMAZ 15',
            quantity: '500',
            weight: '320',
            harvestDate: '04/15/2025',
            region: 'North_Central',
            farmAddress: 'Benue Farming Estate, Makurdi, Benue State'
        },
        {
            seedName: 'Rice Paddy',
            seedVariety: 'FARO 44',
            quantity: '750',
            weight: '28',
            harvestDate: '03/22/2025',
            region: 'South_South',
            farmAddress: 'Agbor Rice Farm, Delta State'
        },
        {
            seedName: 'Cowpea',
            seedVariety: 'IT89KD-288',
            quantity: '320',
            weight: '150',
            harvestDate: '04/05/2025',
            region: 'North_West',
            farmAddress: 'Zaria Agricultural Development, Kaduna State'
        },
        {
            seedName: 'Sorghum',
            seedVariety: 'CSR-01',
            quantity: '600',
            weight: '25',
            harvestDate: '03/10/2025',
            region: 'North_East',
            farmAddress: 'Bauchi Seed Farm, Bauchi State'
        },
        {
            seedName: 'Soybean',
            seedVariety: 'TGX1835-10E',
            quantity: '450',
            weight: '120',
            harvestDate: '03/28/2025',
            region: 'South_East',
            farmAddress: 'Abakaliki Farming Cooperative, Ebonyi State'
        }
    ];

    const handlePurchase = (seedName) => {
        console.log(`Purchasing ${seedName}`);
        // Add your purchase logic here
    };

    return (
        <div className='bg-white rounded-lg shadow p-6 min-h-screen'>
            <div className="bg-white rounded-lg p-6 w-full">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Certified Seeds Ready for Purchase</h2>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Seed Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Seed Variety
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Quantity (kg)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Weight per 1000 seeds (g)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Harvest Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Region
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Farm Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-800 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {seedInfo.map((seed, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaLeaf className="text-green-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">{seed.seedName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaLeaf className="text-green-500 mr-2" />
                                            <span className="text-sm text-gray-500">{seed.seedVariety}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaWeightHanging className="text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">{seed.quantity} kg</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaWeightHanging className="text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">{seed.weight} g</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">{seed.harvestDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">{seed.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                                            <span className="text-sm text-gray-500">{seed.farmAddress}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handlePurchase(seed.seedName)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-xs text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <FaShoppingCart className="mr-2" />
                                            Purchase
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SeedCheckout;