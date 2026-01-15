import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'
import backgroundImage from '../../assets/images/loginback.png'
import { FaCode } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHead from '@/components/loginheader/LoginHead';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ............................................. dispatch .............................................
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();
  // ............................................. navigate .............................................
  const navigate = useNavigate();
  // ............................................. location .............................................
  const location = useLocation();


  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // ............................................. toggle password visibility .............................................
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //............................................. handle submit .............................................
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result.user));
      toast.success('Login successful!');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  //............................................. error message .............................................
  const errorMessage = error && 'data' in error 
    ? (error.data as { message?: string })?.message || 'Login failed. Please try again.'
    : null;

  return (
    <>
    <LoginHead/>
      <div className="min-h-screen flex flex-col mt-[-100px] md:mt-[-50px]">
        <div
          className="flex-1 flex justify-center  items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          {/* ............................................. Light overlay ............................................. */}
          <div className="absolute inset-0 bg-opacity-30"></div>

          {/* ............................................. Login Card ............................................. */}
          <div className="relative z-10 mt-[30px] bg-white/70 rounded-lg shadow-2xl p-6 sm:p-8 w-full md:max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
              Login
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errorMessage}
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 bg-gray-50"
                    placeholder="Enter your Email"
                    required
                    disabled={isLoading}
                  />
                  <FaUser className="absolute right-4 text-blue-400" />
                </div>
              </div>

              {/* ............................................. Password Input ............................................. */}
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 bg-gray-50"
                    placeholder="Enter your Password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 text-blue-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* ............................................. Login Button ............................................. */}
              <div className="mt-[-25px]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white py-3 rounded font-bold hover:bg-blue-600 transition duration-300 mt-8 uppercase text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login »'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ............................................. Footer ............................................. */}
        <footer className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            {/* Bottom Text */}
            <div className="text-center mt-[-10px] ">
              <div className="inline-flex justify-center items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-600 rounded-full whitespace-nowrap blink-glow">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Developed By
                </span>
                <span className="text-blue-600 font-bold text-xs sm:text-sm flex items-center gap-1">
                  <FaCode size={14} />
                  Sudhagar M
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Login
  
