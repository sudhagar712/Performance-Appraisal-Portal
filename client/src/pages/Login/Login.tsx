import { useState, useEffect } from "react";
import { useLoginMutation } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import LoginFooter from "./LoginFooter";
import loginLeftImage from "../../assets/images/loginleft.png";



export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);


  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "manager" ? "/manager" : "/employee", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  
  // ......................Submit Form......................
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials(res.user));
      navigate(res.user.role === "manager" ? "/manager" : "/employee");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      alert(error?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        .blue-gradient-bg {
          background: linear-gradient(180deg, #87CEEB 0%, #4A90E2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .wavy-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
        }
        
        .wavy-shapes::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.25) 0%, transparent 50%);
          animation: wave 20s ease-in-out infinite;
        }
        
        @keyframes wave {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-50px, -50px) rotate(5deg);
          }
        }
        
        .logo-b {
          font-size: 4rem;
          font-weight: bold;
          color: white;
          position: relative;
          display: inline-block;
        }
        
        .logo-arrow {
          position: absolute;
          left: -0.3em;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .input-green {
          background-color: #E8F5E9;
          border: none;
          color: #2E7D32;
        }
        
        .input-green::placeholder {
          color: #66BB6A;
        }
        
        .input-green:focus {
          outline: none;
          background-color: #C8E6C9;
        }
        
        .btn-gradient {
          background: linear-gradient(90deg, #4A90E2 0%, #357ABD 100%);
        }
        
        .btn-gradient:hover {
          background: linear-gradient(90deg, #357ABD 0%, #2E6DA4 100%);
        }
      `}</style>
     
      <div className="min-h-screen flex flex-col md:flex-row relative">
    
        <div className="blue-gradient-bg w-full md:w-1/2 flex flex-col justify-start md:items-center md:justify-center p-6 md:p-12 relative min-h-[45vh] md:min-h-screen overflow-hidden">
          <div className="wavy-shapes"></div>
          
      
         
         
          <div className="absolute inset-0 flex items-center justify-center z-10 md:p-2">
            <img 
              src={loginLeftImage} 
              alt="Login Illustration" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        
        </div>

        <div className="w-full md:w-1/2 mt-5 bg-white flex items-start md:items-center justify-center p-5 md:p-12 md:relative">
          <div className="w-full max-w-md md:max-w-md -mt-16 md:mt-0 bg-white rounded-t-3xl md:rounded-none shadow-lg md:shadow-none p-6 md:p-0 z-20">
            <div className="hidden md:block mb-8">
              <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Welcome</h1>
              <p className="text-gray-500 text-sm">Login in to your account to continue.</p>
            </div>
            
         
            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-bold  text-center mb-4">Login</h1>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* Email Field */}
              <div>
                <input
                  className="w-full bg-blue-50 p-4 rounded-xl text-base"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    className="w-full bg-blue-50 p-4 rounded-xl text-base pr-12"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>


              {/* Login Button */}
              <button
                type="submit"
                className="w-full btn-gradient text-white p-4 rounded-xl font-bold text-base uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOG IN"}
              </button>

            
            </form>
            
            <div className="mt-6">
              <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
