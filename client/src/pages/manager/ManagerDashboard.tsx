import DashboardLayout from "../../components/DashboardLayout";
import { useManagerSubmissionsQuery } from "../../api/appraisalApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function ManagerDashboard() {
  const { data, isLoading } = useManagerSubmissionsQuery();
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
    <DashboardLayout title="Manager Dashboard">
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

        {/* All Submissions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-600" />
            All Submissions
          </h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-teal-600"></div>
            </div>
          ) : submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.map((appraisal) => {
                const statusConfig = {
                  submitted: {
                    bg: "bg-blue-100",
                    text: "text-blue-800",
                    border: "border-blue-200",
                    icon: Clock,
                  },
                  reviewed: {
                    bg: "bg-purple-100",
                    text: "text-purple-800",
                    border: "border-purple-200",
                    icon: CheckCircle2,
                  },
                  approved: {
                    bg: "bg-green-100",
                    text: "text-green-800",
                    border: "border-green-200",
                    icon: Award,
                  },
                };

                const config =
                  statusConfig[
                    appraisal.status as keyof typeof statusConfig
                  ] || statusConfig.submitted;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={appraisal._id}
                    className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {appraisal.employeeId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-lg">
                            {appraisal.employeeId?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {appraisal.employeeId?.email}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-600">
                              Cycle: <span className="font-medium">{appraisal.cycle}</span>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">
                              {new Date(appraisal.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-full border flex items-center gap-2 ${config.bg} ${config.text} ${config.border}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium capitalize">
                            {appraisal.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/manager/review/${appraisal._id}`)}
                        className="ml-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {appraisal.status === "submitted" ? "Review" : "View"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No submissions yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Employee appraisals will appear here once submitted
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
