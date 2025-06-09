  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { toast } from 'react-hot-toast'; 
  import { FcGoogle } from 'react-icons/fc';
  import SeedImage from '../../assets/images/seeds.jpg';
  import { useAuthStore } from '../../store/slices/auth-slice';

  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const { login, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
      return () => {
        clearError();
      };
    }, [clearError]);


    const handleInputChange = (setter) => (e) => {
      setter(e.target.value);
      if (error) {
        clearError();
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();    
      try {
        const credentials = { username, password };
        await login(credentials);
        const { user } = useAuthStore.getState();
        if (user && user.role) {
          toast.success(`${username} successfully logged in`)
          navigate('/dashboard'); 
        } else {
          navigate('/role');
        }
      } catch (error) {
        toast.error(error?.response?.data?.detail || 'Login failed');
        console.error('Login failed:', error);
      }
    };

    return (
      <div className="flex min-h-screen"> 
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold mb-6 lg:text-3xl">Login</h2>
            <p className="text-gray-600 mb-6">See your growth and get support!</p>
            
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 mb-4">
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </button>            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium lg:text-lg text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300  rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm  lg:text-lg font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  id="password"
                  placeholder="minimum 8 characters"
                  className="w-full px-3 py-2 border border-gray-300  rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-xs shadow-sm text-sm font-medium text-white 
                  ${isLoading 
                    ? 'bg-green-700 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              Not registered yet?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        <div className="hidden md:block md:w-1/2">
          <img 
            src={SeedImage} 
            alt="Seeds in hands" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  };

  export default Login;