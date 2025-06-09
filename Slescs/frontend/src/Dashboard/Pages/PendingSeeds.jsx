import React, { useState, useEffect } from 'react';
import { Sprout } from "lucide-react"
import { FaLeaf, FaWeightHanging, FaCalendarAlt, FaUser, FaFileAlt, FaTimes, FaCheckCircle, FaExclamationCircle, FaUnlock } from 'react-icons/fa';
import { GiPadlock } from 'react-icons/gi'
import { useSeedStore } from '../../store/slices/seed-slice';
import { toast } from 'react-hot-toast';

const PendingSeeds = () => {
    const { 
        getInspectorSeedReports, 
        updateSeedReport, 
        updateInspectorSeedReports,
        lockSeed,
        unlockSeed, 
        checkSeedLock,
        inspectorPendingSeeds, 
        isLoading, 
        error 
    } = useSeedStore();
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSeed, setCurrentSeed] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showLockConfirmModal, setShowLockConfirmModal] = useState(false);
    const [showLockedByModal, setShowLockedByModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [certificationStatus, setCertificationStatus] = useState('INSPECTOR');
    const [submission, setSubmission] = useState('');
    const [testDate, setTestDate] = useState('');
    const [testResult, setTestResult] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocking, setIsLocking] = useState(false);
    const [seedToLock, setSeedToLock] = useState(null);
    const [seedLockStatuses, setSeedLockStatuses] = useState({});
    const [lockedByUser, setLockedByUser] = useState('');

    useEffect(() => {
        loadPendingSeeds();
    }, []);

    useEffect(() => {
        if (inspectorPendingSeeds && inspectorPendingSeeds.length > 0) {
            loadSeedLockStatuses();
        }
    }, [inspectorPendingSeeds]);

    const loadPendingSeeds = async () => {
        try {
            await getInspectorSeedReports();
        } catch (error) {
            toast.error("Failed to load seed reports");
            console.error('Error loading pending seeds:', error);
        }
    };


    const checkAndUpdateLockStatus = async (seedId) => {
        try {
            const lockStatus = await checkSeedLock(seedId);
            setSeedLockStatuses(prev => ({
                ...prev,
                [seedId]: lockStatus
            }));
            return lockStatus;
        } catch (error) {
            console.error('Error checking lock status:', error);
            return { locked: false, info: {} };
        }
    };

    const loadSeedLockStatuses = async () => {
        if (inspectorPendingSeeds && inspectorPendingSeeds.length > 0) {
            const lockPromises = inspectorPendingSeeds.map(seed => 
                checkAndUpdateLockStatus(seed.seed_id)
            );
            await Promise.all(lockPromises);
        }
    };


    const isSeedLocked = (seed) => {
        const lockStatus = seedLockStatuses[seed.seed_id];
        console.log(lockStatus)
        return lockStatus?.locked || false;
    };

    const isSeedLockedByCurrentUser = (seed) => {
        const lockStatus = seedLockStatuses[seed.seed_id];
        const currentUsername = localStorage.getItem('username');
        return lockStatus?.locked && lockStatus?.info?.who === currentUsername;
    };


    const handleOpenModal = (seed) => {
        setCurrentSeed(seed);
        setCertificationStatus(seed.status || 'INSPECTOR');
        setSubmission('');
        setTestDate('');
        setTestResult('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSeed(null);
        setCertificationStatus('INSPECTOR');
        setSubmission('');
        setTestDate('');
        setTestResult('');
    };

    const handleSubmitReport = async () => {
        if (certificationStatus === 'INSPECTOR') {
            toast.error('Please update the certification status to APPROVED or AGENCY before submitting the report');
            return;
        }        
        try {
            setIsSubmitting(true);
            const username = localStorage.getItem('username');
            if (!username) {
                toast.error('Username not found');
                return;
            }
            const reportData = {
                username: username,
                seed_id: currentSeed.seed_id,
                inspector: username,
                data: {
                    inspection_details: {
                        "1": {
                            data: {
                                test_date: testDate,
                                test_result: testResult,
                                submission: submission
                            }
                        }
                    }
                }
            };
            await updateInspectorSeedReports(reportData);
            await getInspectorSeedReports(); 
            toast.success('Report updated successfully');
            handleCloseModal();
        } catch (error) {
            toast.error('Failed to update report');
            console.error('Save error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (newStatus !== 'INSPECTOR') {
            setPendingStatus(newStatus);
            setShowConfirmModal(true);
        } else {
            setCertificationStatus(newStatus);
        }
    };

    const confirmStatusChange = async () => {
        try {
            const seedOwnerUsername = currentSeed.owner;            
            if (!seedOwnerUsername) {
                toast.error('Seed owner not found');
                return;
            }
            
            await updateSeedReport(seedOwnerUsername, currentSeed.seed_id, { status: pendingStatus })
            setCertificationStatus(pendingStatus);
            setShowConfirmModal(false);
            setPendingStatus(null);
            
            toast.success(`Status updated to ${pendingStatus}`);
            handleCloseModal();
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Update error:', error);
            setShowConfirmModal(false);
            setPendingStatus(null);
        }
    };

    const cancelStatusChange = () => {
        setShowConfirmModal(false);
        setPendingStatus(null);
    };

    const handleToggleLock = (seed) => {
        if (!isSeedLocked(seed)) {
            setSeedToLock(seed);
            setShowLockConfirmModal(true);
        } else {
            handleUnlockSeed(seed);
        }
    };

    // Lock functionality handlers
    const confirmLockSeed = async () => {
        try {
            setIsLocking(true);
            const inspectorUsername = localStorage.getItem('username');
            if (!inspectorUsername) {
                toast.error('Inspector username not found');
                return;
            }

            const lockData = {
                who: inspectorUsername,
                type: "inspector"
            };

            await lockSeed(seedToLock.owner, seedToLock.seed_id, lockData);
            await checkAndUpdateLockStatus(seedToLock.seed_id);
            
            toast.success('Seed locked successfully');
            setShowLockConfirmModal(false);
            setSeedToLock(null);
        } catch (error) {
            toast.error('Failed to lock seed');
            console.error('Lock error:', error);
        } finally {
            setIsLocking(false);
        }
    };

    const cancelLockSeed = () => {
        setShowLockConfirmModal(false);
        setSeedToLock(null);
    };

    // Unlock functionality handler
    const handleUnlockSeed = async (seed) => {
        const lockStatus = seedLockStatuses[seed.seed_id];
        const currentUsername = localStorage.getItem('username');
        
        if (lockStatus?.locked) {
            if (lockStatus.info?.who === currentUsername) {
                // User can unlock - call unlock function when implemented
                await handleUnlockSeedByOwner(seed);
            } else {
                // Show locked by modal
                setLockedByUser(lockStatus.info?.who || 'Unknown user');
                setShowLockedByModal(true);
            }
        }
    };

    // Function for unlocking seed by owner - to be implemented
    const handleUnlockSeedByOwner = async (seed) => {
        try {
            // TODO: Implement when unlock endpoint is ready
            // await unlockSeed(seed.owner, seed.seed_id);
            // await checkAndUpdateLockStatus(seed.seed_id);
            // toast.success('Seed unlocked successfully');
            toast.info('Unlock functionality will be available when endpoint is ready');
        } catch (error) {
            toast.error('Failed to unlock seed');
            console.error('Unlock error:', error);
        }
    };

    // Status badge helper
    const getStatusBadge = (status) => {
        switch(status?.toUpperCase()) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" />
                        Approved
                    </span>
                );
            case 'AGENCY':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaUser className="mr-1" />
                        Agency
                    </span>
                );
            case 'INSPECTOR':
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaExclamationCircle className="mr-1" />
                        INSPECTOR
                    </span>
                );
        }
    };

    if (isLoading && (!inspectorPendingSeeds || inspectorPendingSeeds.length === 0)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-bounce mx-auto mb-3">
                        <Sprout size={48} className="text-green-600" strokeWidth={1.5} />
                    </div>
                    <p className="mt-2 text-gray-600">Loading seed reports...</p>
                </div>
            </div>
        );
    }

    if (error && (!inspectorPendingSeeds || inspectorPendingSeeds.length === 0)) {
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
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => loadPendingSeeds()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xs shadow p-6 min-h-screen">
            <div className="w-full">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Seeds for Certification</h2>
                
                {!inspectorPendingSeeds || inspectorPendingSeeds.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <Sprout size={48} className="mx-auto text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No seed reports</h3>
                        <p className="mt-1 text-gray-500">There are currently no seeds for certification.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Seed Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Seed Variety
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Producer Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Quantity (kg)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Harvest Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Seed Locking
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm md:text-md font-medium text-gray-800 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inspectorPendingSeeds.map((seed, index) => (
                                    <tr key={seed.seed_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <Sprout size={16} className="text-green-500 mr-1" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {seed.seed_report?.seed_details?.seed_name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm text-gray-500">
                                                {seed.seed_report?.seed_details?.seed_variety || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-500">{seed.owner || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <FaWeightHanging className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-500">
                                                    {seed.seed_report?.seed_details?.quantity || 'N/A'} kg
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <FaCalendarAlt className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-500">
                                                    {seed.seed_report?.seed_details?.harvest_date 
                                                        ? new Date(seed.seed_report.seed_details.harvest_date).toLocaleDateString()
                                                        : 'N/A'
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleToggleLock(seed)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-xs text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    {isSeedLocked(seed) ? (
                                                        <FaUnlock className="text-white mr-2" />
                                                    ) : (
                                                        <GiPadlock className="text-white mr-2" />
                                                    )}
                                                    {isSeedLocked(seed) ? 'Unlock' : 'Lock'}
                                                </button>                                                
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(seed.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleOpenModal(seed)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-xs text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <FaFileAlt className="mr-2" />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Lock Confirmation Modal */}
            {showLockConfirmModal && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xs shadow-xl w-full max-w-md mx-4 animate-fadeIn">
                        <div className="bg-green-500 text-white px-6 py-4 rounded-t-xs">
                            <h3 className="text-lg font-bold">Confirm Seed Lock</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to lock this seed for inspection? This will prevent other inspectors from working on it.
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelLockSeed}
                                    disabled={isLocking}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLockSeed}
                                    disabled={isLocking}
                                    className="px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-600 disabled:opacity-50"
                                >
                                    {isLocking ? 'Locking...' : 'Yes, Lock Seed'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Locked By Modal */}
            {showLockedByModal && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xs shadow-xl w-full max-w-md mx-4 animate-fadeIn">
                        <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xs">
                            <h3 className="text-lg font-bold">Seed Locked</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-700 mb-6">
                                This seed is currently locked by <strong>{lockedByUser}</strong>. You cannot unlock it.
                            </p>
                            
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowLockedByModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xs shadow-xl w-full max-w-md mx-4 animate-fadeIn">
                        <div className="bg-green-500 text-white px-6 py-4 rounded-t-xs">
                            <h3 className="text-lg font-bold">Confirm Status Change</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to change the status to "{pendingStatus}"?
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelStatusChange}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusChange}
                                    className="px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-600"
                                >
                                    Yes, Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
     
            {/* Certification Modal */}
            {isModalOpen && currentSeed && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/30 flex items-center justify-center z-30">
                    <div className="bg-white rounded-xs shadow-lg w-full max-w-lg mx-4">
                        <div className="bg-green-600 text-white px-6 py-4 rounded-t-xs flex justify-between items-center">
                            <h3 className="text-xl font-bold">Seed Certification</h3>
                            <button 
                                onClick={handleCloseModal}
                                className="text-white hover:text-gray-200 focus:outline-none"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Seed Name</label>
                                    <div className="mt-1 flex items-center bg-gray-100 p-2 rounded-xs">
                                        <FaLeaf className="text-green-500 mr-2" />
                                        <span>
                                            {currentSeed.seed_report?.seed_details?.seed_name} 
                                            ({currentSeed.seed_report?.seed_details?.seed_variety})
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Producer Name</label>
                                    <div className="mt-1 flex items-center bg-gray-100 p-2 rounded-xs">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <span>{currentSeed.owner}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Submission</label>
                                    <div className="mt-1 flex items-center border border-gray-300 p-2 rounded-xs bg-white">
                                        <Sprout size={16} className="text-green-500 mr-2" />
                                        <input 
                                            type="text" 
                                            placeholder="Enter submission details..."
                                            value={submission}
                                            onChange={(e) => setSubmission(e.target.value)}
                                            className="flex-1 border-none outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Test Date</label>
                                    <div className="mt-1 flex items-center border border-gray-300 p-2 rounded-xs bg-white">
                                        <FaCalendarAlt className="text-gray-400 mr-2" />
                                        <input 
                                            type="date" 
                                            value={testDate}
                                            onChange={(e) => setTestDate(e.target.value)}
                                            className="flex-1 border-none outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Test Result</label>
                                    <div className="mt-1 flex items-center border border-gray-300 p-2 rounded-xs bg-white">
                                        <FaFileAlt className="text-gray-400 mr-2" />
                                        <input 
                                            type="text" 
                                            placeholder="Enter test results..."
                                            value={testResult}
                                            onChange={(e) => setTestResult(e.target.value)}
                                            className="flex-1 border-none outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                    
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Certification Status</label>
                                    <div className="mt-1 relative rounded-xs shadow-sm">
                                        <select
                                            value={certificationStatus}
                                            onChange={handleStatusChange}
                                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-xs"
                                        >
                                            <option value="INSPECTOR">INSPECTOR</option>
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="AGENCY">AGENCY</option>
                                        </select>
                                    </div>
                     
                                    {certificationStatus === 'INSPECTOR' && (
                                        <p className="mt-1 text-xs text-amber-600 flex items-center">
                                            <FaExclamationCircle className="mr-1" />
                                            Please change status to APPROVED or AGENCY before submission
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-xs text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitReport}
                                    disabled={isSubmitting || isLoading || certificationStatus === 'INSPECTOR'}
                                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xs text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                        certificationStatus === 'INSPECTOR' 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isSubmitting ? 'Saving...' : 
                                    certificationStatus === 'INSPECTOR' ? 'Select Status First' : 
                                    'Submit Report'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingSeeds;