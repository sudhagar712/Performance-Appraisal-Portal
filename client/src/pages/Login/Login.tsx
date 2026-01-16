import { useState, useEffect } from "react";
import { useLoginMutation } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import loginBackground from "../../assets/images/loginback.png";
import LoginFooter from "./LoginFooter";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/images/navbarlogo.png";


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
        .login-background {
          background-image: url(${loginBackground});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
     
      
      <div className="min-h-screen flex flex-col ">
        <div className="flex-1 flex items-center justify-center login-background p-5">
          <form
            onSubmit={submit}
            className="bg-white/30 backdrop-blur-sm w-full max-w-[600px] p-8 rounded-xl shadow-xl border border-gray-200"
          >
            <h1 className="text-xl md:text-2xl text-center font-bold mb-6 text-gray-800">
              Login 
            </h1>

            {/* email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-white border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-white border border-gray-300 p-3 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "LOGIN >>"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <LoginFooter />
      </div>
    </>
  );
}
