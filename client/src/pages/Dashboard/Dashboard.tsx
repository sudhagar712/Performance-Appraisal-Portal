import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLogoutMutation } from '../../store/api/authApi';
import { clearCredentials } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(clearCredentials());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome, {user?.name}!
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-base font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role:</p>
              <p className="text-base font-medium text-gray-900 capitalize">{user?.role}</p>
            </div>
            {user?.managerId && (
              <div>
                <p className="text-sm text-gray-600">Manager ID:</p>
                <p className="text-base font-medium text-gray-900">{user.managerId}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

