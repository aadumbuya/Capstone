import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { X, Home, User, FileText, Settings, Leaf, Clipboard, CheckSquare, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();
  const userRole = user?.role || '';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getNavItems = () => {
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },      
    ];
    
    if (userRole === 'seed_producer') {
      items.push(
        { name: 'Profile', path: '/dashboard/producer-profile', icon: <User size={20} /> },
        { name: 'Submit for Certification', path: '/dashboard/submit', icon: <Clipboard size={20} /> },
        { name: 'My Seeds', path: '/dashboard/seeds', icon: <Leaf size={20} /> },
        { name: 'Approved Seeds', path: '/dashboard/certified-seeds', icon: <CheckSquare size={20} /> },
        { name: 'Seed Checkout', path: '/dashboard/checkout', icon: <FileText size={20} /> }
      );
    } else if (userRole === 'seed_dealer') {
      items.push(
        { name: 'Profile', path: '/dashboard/dealer-profile', icon: <User size={20} /> },
        { name: 'Submit for Certification', path: '/dashboard/submit', icon: <Clipboard size={20} /> },
        { name: 'My Seeds', path: '/dashboard/seeds', icon: <Leaf size={20} /> },
        { name: 'Approved Seeds', path: '/dashboard/certified-seeds', icon: <CheckSquare size={20} /> },
        { name: 'Seed Checkout', path: '/dashboard/checkout', icon: <FileText size={20} /> }
      );
    } else if (userRole === 'seed_importer') {
      items.push(
        { name: 'Profile', path: '/dashboard/importer-profile', icon: <User size={20} /> },
        { name: 'Submit for Certification', path: '/dashboard/submit', icon: <Clipboard size={20} /> },
        { name: 'My Seeds', path: '/dashboard/seeds', icon: <Leaf size={20} /> },
        { name: 'Approved Seeds', path: '/dashboard/certified-seeds', icon: <CheckSquare size={20} /> },
        { name: 'Seed Checkout', path: '/dashboard/checkout', icon: <FileText size={20} /> }
      );
    } else if (userRole === 'seed_inspector') {
      items.push(
        { name: 'Profile', path: '/dashboard/inspector-profile', icon: <User size={20} /> },
        { name: 'Pending Inspections', path: '/dashboard/pending', icon: <Clipboard size={20} /> },
        { name: 'Approved Seeds', path: '/dashboard/certified-seeds', icon: <CheckSquare size={20} /> },
      );
    }
     
    return items;
  };
  
  const navItems = getNavItems();
  return (
    <>
      <div className={`fixed inset-0 flex z-40 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity ease-linear duration-300`}>
        <div 
          className={`fixed inset-0 bg-opacity-75 transition-opacity ease-linear duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsOpen(false)}
        ></div>
        <div className={`relative flex-1 flex flex-col max-w-[15rem] w-4/5 bg-green-700 transform transition ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>          
          <div className="flex-shrink-0 flex items-center px-4 py-5">
            <h1 className="text-xl font-bold text-white">Seed Certification</h1>
          </div>          
          
          {/* Using flex-col and flex-1 to push logout to bottom */}
          <div className="flex flex-col flex-1 h-full">
            {/* Main nav items section */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => 
                      `group flex items-center px-2 py-2 text-base font-medium rounded-xs ${
                        isActive
                          ? 'bg-green-800 text-white'
                          : 'text-green-100 hover:bg-green-600'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            {/* Logout section pushed to bottom */}
            <div className="mt-auto px-2 py-4 border-t border-green-600">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-200 hover:text-white hover:bg-red-600 rounded-xs"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar - unchanged */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col lg:w-64 md:w-48">
          <div className="flex flex-col h-full bg-green-700">
            <div className="flex items-center h-[5rem] flex-shrink-0 px-4 bg-green-800">
              <h1 className="text-xl font-bold text-white">Seed Certification</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => 
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-xs ${
                        isActive
                          ? 'bg-green-800 text-white'
                          : 'text-green-100 hover:bg-green-600'
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              <div className="px-2 py-4 border-t border-green-600">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-2 py-2 text-md text-white hover:text-white hover:bg-red-600 rounded-xs"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;