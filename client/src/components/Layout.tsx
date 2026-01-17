import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCredentials } from "../features/auth/authSlice";
import { User } from "lucide-react";

export default function Layout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [imageError, setImageError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Ignore logout errors
    }
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
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
              <span className="hidden md:inline">Profile</span>
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
            >
              Notifications
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

