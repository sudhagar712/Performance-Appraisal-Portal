import ManagerDashboardLayout from "../../components/ManagerLayout/ManagerDashboardLayout";
import { useManagerSubmissionsQuery } from "../../api/appraisalApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

import {
  Users,
  FileCheck,
  Clock,
  Award,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function ManagerDashboard() {
  const { data} = useManagerSubmissionsQuery();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const submissions = data?.submissions || [];
  const stats = {
    total: submissions.length,
    pending: submissions.filter((a) => a.status === "submitted").length,
    reviewed: submissions.filter((a) => a.status === "reviewed").length,
    approved: submissions.filter((a) => a.status === "approved").length,
  };

  const pendingReviews = submissions.filter((a) => a.status === "submitted");

  return (
    <ManagerDashboardLayout title="Manager Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-purple-100">
            Review and manage employee performance appraisals
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Submissions</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600 mt-1">Pending Reviews</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.reviewed}</p>
            <p className="text-sm text-gray-600 mt-1">Reviewed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-600 mt-1">Approved</p>
          </div>
        </div>




















        {/* Pending Reviews Section */}
        {pendingReviews.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Pending Reviews ({pendingReviews.length})
                </h2>
                <p className="text-sm text-gray-600">
                  These appraisals are waiting for your review
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {pendingReviews.slice(0, 3).map((appraisal) => (
                <div
                  key={appraisal._id}
                  className="bg-white p-4 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {appraisal.employeeId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appraisal.employeeId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appraisal.cycle} • Submitted{" "}
                        {new Date(appraisal.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/manager/review/${appraisal._id}`)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Review Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      
      </div>
    </ManagerDashboardLayout>
  );
}
