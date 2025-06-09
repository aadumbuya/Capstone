import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; 
import { Link } from 'react-router-dom';
import Edible from '../../assets/images/edible.jpeg';
import { useAuthStore } from '../../store/slices/auth-slice';

const Signup = () => {
  const { register, error, clearError, checkUsernameUnique } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({    
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if(error){
      clearError();
    }
  }, [formData])

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };  

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    try {
      const isUnique = await checkUsernameUnique(formData.username);      
      if (!isUnique) {
        toast.error('Username already exists. Please choose a different username.');
        setIsSubmitting(false);
        return;
      }
      const submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword, 
        first_name: formData.firstName,  
        last_name: formData.lastName
      };
      await register(submitData)
      toast.success("User successfully registered")
      setIsRegistered(true)
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        'Registration failed'
      );      
      console.error('Registration failed:', error);
    }    
    finally {
      setIsSubmitting(false);
    };
  }

  return (
    <div className="flex flex-col min-h-screen">      
      <div className="flex flex-1">        
        <div className="w-full md:w-1/2 flex flex-col justify-center">      
          <div className="max-w-lg mx-auto w-full p-8 ">       
           
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Create an Account</h2>  
            {isRegistered ? (
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-2">Check your email!</h3>
                <p className="text-gray-600 mb-4 ">
                  We've sent an activation link to your email <strong>{formData.email}</strong>. 
                  Please click the link in your email to complete your registration.
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                    Go to Login
                  </Link>
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </div>
            ) : (
              <>
                <p className="text-green-600 mb-6 text-sm ">
                  Manage all your seed-tracking needs using Digital Seed Certification System!
                  Let's get you set up so you can verify your personal account and begin setting up your seed profile.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">First name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">Last name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="minimum 8 characters"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">Phone no.</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="minimum 8 characters"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="text" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Choose a unique username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm lg:text-lg font-medium text-gray-700 mb-1">ConfirmPassword</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 ">
                      I agree to all terms, privacy <span className="text-green-600">policies</span> and <span className="text-green-600">fees</span>.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 border border-transparent rounded-xs shadow-sm text-sm lg:text-lg font-medium text-white 
                      ${isSubmitting 
                        ? 'bg-green-700 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                      } focus:outline-none  focus:ring-green-500`}
                  >
                    {isSubmitting ? 'Creating account...' : 'Sign up'}
                  </button>
                </form>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                    Log in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>       

        <div className="hidden md:block md:w-1/2">
          <img 
            src={Edible} 
            alt="Seeds in hands" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;  