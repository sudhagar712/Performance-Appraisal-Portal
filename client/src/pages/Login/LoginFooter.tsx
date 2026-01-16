import { Code } from "lucide-react";
import logo from "../../assets/images/navbarlogo.png";

const LoginFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Bottom Text */}
        <div className="mt-6 ">
          <div className="flex  flex-col items-center justify-center ">
            <img src={logo} alt="login background logo" className="w-[180px] sm:w-[180px] " />
            {/* Developed By Badge */}
            <div className="flex items-center gap-2 blink-glow  px-5 py-3 bg-white border border-gray-200 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="text-gray-700 font-medium text-sm">
                Developed By
              </span>
              <Code className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">
                Sudhagar M
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;
