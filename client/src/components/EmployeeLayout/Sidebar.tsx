import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearCredentials } from "../../features/auth/authSlice";
import {
  User,
  X,
  Home,
  FileText,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [imageError, setImageError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
    } catch {
      // Ignore logout errors
    }
    dispatch(clearCredentials());
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: user?.role === "employee" ? "/employee" : "/manager",
      active: location.pathname === "/employee" || location.pathname === "/manager",
    },
    {
      name: "Appraisals",
      icon: FileText,
      path: user?.role === "employee" ? "/employee" : "/manager",
      active: location.pathname.includes("/appraisal") || location.pathname.includes("/review"),
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      active: location.pathname === "/notifications",
    },
    {
      name: "Profile",
      icon: Settings,
      path: "/profile",
      active: location.pathname === "/profile",
    },
  ];

  return (
    <>
   
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

     
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Performance Portal</h2>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                title="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user?.profileImage && imageError !== user.profileImage ? (
                <img
                  src={
                    user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `${import.meta.env.VITE_API_URL}${user.profileImage}`
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={() => setImageError(user.profileImage || null)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      item.active
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

