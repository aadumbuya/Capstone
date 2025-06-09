import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';


const Header = ({ setSidebarOpen }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const formatRole = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-[5rem] bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 md:block hidden">Application Dashboard</h1>
        </div>        
        <div className="ml-4 flex items-center md:ml-6">        
          <div className="ml-3 relative flex items-center">        
            <div className="mr-5">
              <div className="text-lg font-medium text-gray-700">
                {user?.username || 'User'}
              </div>
              <div className="text-xs text-gray-800">
                {formatRole(user?.role)}
              </div>
            </div>

            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center mr-6 md:mr-10 justify-center">
              <span className="text-sm font-medium text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          </div>    
        </div>
      </div>
    </header>
  );
};

export default Header;