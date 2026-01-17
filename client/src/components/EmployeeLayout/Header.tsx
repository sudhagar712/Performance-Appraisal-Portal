import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { User, Menu, Bell } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
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
  );
}

