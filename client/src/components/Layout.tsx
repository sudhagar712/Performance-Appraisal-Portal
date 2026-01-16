import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCredentials } from "../features/auth/authSlice";

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

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {}
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

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/notifications")}
              className="px-4 py-2 border rounded"
            >
              Notifications
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded"
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
