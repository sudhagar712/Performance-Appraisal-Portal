import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCredentials } from "../features/auth/authSlice";
import {
  User,
  Menu,
  X,
  Home,
  FileText,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [imageError, setImageError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Performance Portal</h2>
              <button
                onClick={() => setSidebarOpen(false)}
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
                    setSidebarOpen(false);
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
                title="Open sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {title || "Dashboard"}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {user?.role === "employee" ? "Employee" : "Manager"} Portal
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/notifications")}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile"
              >
                {user?.profileImage && imageError !== user.profileImage ? (
                  <img
                    src={
                      user.profileImage.startsWith("http")
                        ? user.profileImage
                        : `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => setImageError(user.profileImage || null)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

