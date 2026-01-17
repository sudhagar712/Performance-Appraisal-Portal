import { useState, useEffect } from "react";
import { useLoginMutation } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import LoginFooter from "./LoginFooter";
import loginLeftImage from "../../assets/images/loginleft.png";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "manager" ? "/manager" : "/employee", {
        replace: true,
      });
    }
  }, [isAuthenticated, user, navigate]);

  // ......................Submit Form......................
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials(res.user));
      navigate(res.user.role === "manager" ? "/manager" : "/employee");
      toast.success("Welcome back, " + res.user.name);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row relative px-2 sm:px-6 md:px-8 lg:px-12">
        {/* Left Section - Image */}
        <div className="blue-gradient-bg w-full md:w-1/2 flex flex-col justify-start md:items-center md:justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative min-h-[40vh] sm:min-h-[45vh] md:min-h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center z-10 ">
            <img
              src={loginLeftImage}
              alt="Login Illustration"
              className="w-full h-full object-contain object-center"
            />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 mt-4 sm:mt-5 md:mt-0 bg-white flex items-start md:items-center justify-center p-4 sm:p-5 md:p-10 lg:p-12 md:relative">
          <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-md -mt-12 sm:-mt-16 md:mt-0 bg-white rounded-t-3xl md:rounded-none shadow-lg md:shadow-none p-5 sm:p-6 md:p-8 lg:p-0 z-20">
            <div className="hidden md:block mb-6 lg:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#1E3A5F] mb-2">
                Welcome
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Login in to your account to continue.
              </p>
            </div>

        
            <div className="md:hidden mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
                Login
              </h1>
            </div>

            <form
              onSubmit={submit}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              {/* Email Field */}
              <div>
                <input
                  className="w-full bg-[#e2d6fc]/50 p-3 sm:p-4 md:p-4 lg:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-base"
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
                    className="w-full bg-[#e2d6fc]/50 p-3 sm:p-4 md:p-4 lg:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-base pr-10 sm:pr-12"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#8a76ef] text-white p-3 sm:p-4 md:p-4 lg:p-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOG IN"}
              </button>
            </form>

            <div className="mt-5 sm:mt-6 md:mt-8">
              <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
