import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function NotFound() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); 
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg text-center p-8">
        <div className="mb-8 flex justify-center">
          <svg 
            className="w-64 h-64 text-green-600" 
            viewBox="0 0 512 512" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256 42.667c-117.821 0-213.333 95.513-213.333 213.333S138.179 469.333 256 469.333 469.333 373.821 469.333 256 373.821 42.667 256 42.667zm0 384c-94.257 0-170.667-76.41-170.667-170.667S161.743 85.333 256 85.333 426.667 161.744 426.667 256 350.257 426.667 256 426.667z" />
            <path d="M256 298.667c11.797 0 21.333-9.536 21.333-21.333V160c0-11.797-9.536-21.333-21.333-21.333s-21.333 9.536-21.333 21.333v117.333c0 11.798 9.536 21.334 21.333 21.334z" />
            <circle cx="256" cy="352" r="21.333" />
          </svg>
        </div>
        <h1 className="text-8xl font-bold text-green-600 mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          You'll be redirected to the login page shortly.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors shadow-md"
        >
          <FaArrowLeft className="mr-2" />
          Go to Login
        </Link>
        
        <p className="mt-6 text-sm text-gray-500">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
}

export default NotFound;