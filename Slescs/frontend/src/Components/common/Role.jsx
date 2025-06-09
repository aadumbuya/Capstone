import { useState, useEffect } from 'react';
import { X, Users, User, Briefcase, Code, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/slices/auth-slice';
import { toast } from 'react-hot-toast';

export default function RoleSelection() {
  const [isModalOpen, setIsModalOpen] = useState(true); 
  const [selectedRole, setSelectedRole] = useState('');
  const { user, isLoading, setUserRole } = useAuthStore();
  const [modalAnimation, setModalAnimation] = useState('animate-fadeIn');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000); 
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Current user state:", useAuthStore.getState().user);
  }, []);
  
  const roles = [
    { 
      id: 'seed_producer', 
      title: 'Seed Producer', 
      description: 'Produce and submit seed samples to get Certified',
      redirectUrl: '/dashboard',
      icon: <Briefcase className="text-green-600" size={24} />
    },
    { 
      id: 'seed_dealer', 
      title: 'Seed Dealers', 
      description: 'Purchase and Sell Certified Seeds',
      redirectUrl: '/dashboard',
      icon: <Briefcase className="text-green-600" size={24} />
    },
    { 
      id: 'seed_importer', 
      title: 'Seed Importer',
      description: 'Import and distribute seed samples',
      redirectUrl: '/dashboard',
      icon: <User className="text-green-600" size={24} />
    },
    { 
      id: 'seed_inspector', 
      title: 'Seed Inspector', 
      description: 'Inspect and Certify Seed Samples from producers',
      redirectUrl: '/dashboard',
      icon: <Users className="text-green-600" size={24} />
    }
  ];

  const closeModal = () => {
    setModalAnimation('animate-fadeOut');
    setTimeout(() => {
      setIsModalOpen(false);
      setModalAnimation('animate-fadeIn');
    }, 300);
  };
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };
  
  const handleSubmit = async () => {
    if (selectedRole) {
      setIsSubmitting(true);      
      try {
        await setUserRole(selectedRole.id);
        toast.success(`Role set as ${selectedRole.title}`);
        
        setTimeout(() => {
          navigate(selectedRole.redirectUrl);
          closeModal();
        }, 500);
      } catch (error) {
        const errorMessage = 
          error?.response?.data?.message || 
          error?.message || 
          'Failed to set role';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  useEffect(() => {
    setIsModalOpen(true);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .animate-pulse-once {
          animation: pulse 0.5s ease-out;
        }
        .animate-slide-in {
          animation: slideIn 0.35s ease-out forwards;
        }
        .stagger-delay-1 { animation-delay: 0.05s; }
        .stagger-delay-2 { animation-delay: 0.1s; }
        .stagger-delay-3 { animation-delay: 0.15s; }
      `}</style>
      
      <h1 className="text-2xl font-bold mb-6">Choose Your Role on this Platform</h1>
      
      {isInitialLoading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-green-600 mb-4" size={36} />
          <p className="text-gray-600">Preparing options...</p>
        </div>
      ) : !isModalOpen && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-xs hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          Choose Your Role
        </button>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          
          <div className={`bg-white rounded-xs shadow-xl w-full max-w-md mx-4 ${modalAnimation}`}>
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-xs flex justify-between items-center">
              <h2 className="text-xl font-bold">Select Your Role</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <div 
                    key={role.id}
                    onClick={() => handleRoleChange(role)}
                    className={`p-4 border-2 rounded-xs cursor-pointer transition-all hover:shadow-md animate-slide-in opacity-0 stagger-delay-${index} ${
                      selectedRole?.id === role.id 
                        ? 'border-green-600 bg-green-50 animate-pulse-once' 
                        : 'border-gray-200 hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 transition-transform duration-300 transform group-hover:scale-110">
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{role.title}</h3>
                        <p className="text-gray-600 text-sm">{role.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedRole || isSubmitting}
                  className={`px-4 py-2 rounded-xs text-white transition-all focus:outline-none flex items-center ${
                    selectedRole && !isSubmitting
                      ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}