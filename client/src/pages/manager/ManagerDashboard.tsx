import ManagerDashboardLayout from "../../components/ManagerLayout/ManagerDashboardLayout";
import { useManagerSubmissionsQuery } from "../../api/appraisalApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";

import {
  Users,
  FileCheck,
  Clock,
  Award,
  ArrowRight,
  AlertCircle,
  User,
} from "lucide-react";

interface EmployeeWithProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function ManagerDashboard() {
  const { data} = useManagerSubmissionsQuery();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const submissions = data?.submissions || [];
  const stats = {
    total: submissions.length,
    pending: submissions.filter((a) => a.status === "submitted").length,
    reviewed: submissions.filter((a) => a.status === "reviewed").length,
    approved: submissions.filter((a) => a.status === "approved").length,
  };

  const pendingReviews = submissions.filter((a) => a.status === "submitted");
  const reviewedAppraisals = submissions.filter((a) => a.status === "reviewed");

  // Extract unique employees from submissions
  const uniqueEmployees = Array.from(
    new Map(
      submissions
        .filter((submission) => submission.employeeId)
        .map((submission) => [
          submission.employeeId!._id,
          {
            _id: submission.employeeId!._id,
            name: submission.employeeId!.name,
            email: submission.employeeId!.email,
            profileImage: (submission.employeeId as EmployeeWithProfile)?.profileImage,
          } as EmployeeWithProfile,
        ])
    ).values()
  );

  const handleImageError = (profileImage: string) => {
    setImageErrors((prev) => ({ ...prev, [profileImage]: true }));
  };

  const getImageUrl = (profileImage?: string) => {
    if (!profileImage || imageErrors[profileImage]) return null;
    return profileImage.startsWith("http")
      ? profileImage
      : `${import.meta.env.VITE_API_URL}${profileImage}`;
  };

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

        {/* Reviewed Appraisals Section */}
        {reviewedAppraisals.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Reviewed Appraisals ({reviewedAppraisals.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Appraisals that have been reviewed and are pending employee response
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {reviewedAppraisals.slice(0, 5).map((appraisal) => {
                const selfScore = appraisal.finalScoreEmployee || 0;
                const managerScore = appraisal.finalScoreManager || 0;
                const selfScorePercent = Math.round(selfScore);
                const managerScorePercent = Math.round(managerScore);
                
                return (
                  <div
                    key={appraisal._id}
                    className="bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {appraisal.employeeId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">
                            {appraisal.employeeId?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appraisal.cycle} • Reviewed{" "}
                            {new Date(appraisal.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Final Scores */}
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        {selfScore > 0 && (
                          <div className={`px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                            selfScore >= 80 
                              ? "bg-green-100 text-green-700" 
                              : selfScore >= 60 
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            Self: {selfScorePercent}%
                          </div>
                        )}
                        {managerScore > 0 && (
                          <div className={`px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                            managerScore >= 80 
                              ? "bg-green-100 text-green-700" 
                              : managerScore >= 60 
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            Manager: {managerScorePercent}%
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/manager/review/${appraisal._id}`)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Employees List Section */}
        {uniqueEmployees.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Employees</h2>
                <p className="text-sm text-gray-500">
                  {uniqueEmployees.length} {uniqueEmployees.length === 1 ? "employee" : "employees"} under your management
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uniqueEmployees.map((employee) => {
                const imageUrl = getImageUrl(employee.profileImage);
                const hasImageError =
                  (employee.profileImage && imageErrors[employee.profileImage]) ||
                  !imageUrl;
                const employeeSubmissions = submissions.filter(
                  (s) => s.employeeId?._id === employee._id
                );
                const pendingCount = employeeSubmissions.filter(
                  (s) => s.status === "submitted"
                ).length;
                const reviewedCount = employeeSubmissions.filter(
                  (s) => s.status === "reviewed"
                ).length;
                const approvedCount = employeeSubmissions.filter(
                  (s) => s.status === "approved"
                ).length;

                return (
                  <div
                    key={employee._id}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer transform hover:-translate-y-1"
                    onClick={() => {
                      if (employeeSubmissions.length > 0) {
                        // Navigate to the most recent submission or pending review
                        const pending = employeeSubmissions.find(
                          (s) => s.status === "submitted"
                        );
                        const reviewed = employeeSubmissions.find(
                          (s) => s.status === "reviewed"
                        );
                        const target = pending || reviewed || employeeSubmissions[0];
                        navigate(`/manager/review/${target._id}`);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Image */}
                      <div className="relative mb-4">
                        {imageUrl && !hasImageError ? (
                          <img
                            src={imageUrl}
                            alt={employee.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-blue-200 transition-colors"
                            onError={() =>
                              employee.profileImage && handleImageError(employee.profileImage)
                            }
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:from-blue-500 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all border-4 border-white">
                            {employee.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                      </div>

                      {/* Employee Name */}
                      <h3 className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {employee.name}
                      </h3>

                      {/* Email */}
                      <p className="text-sm text-gray-500 truncate w-full mb-3">
                        {employee.email}
                      </p>

                      {/* Status Badges */}
                      <div className="w-full flex flex-wrap items-center justify-center gap-2">
                        {pendingCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            {pendingCount} Pending
                          </span>
                        )}
                        {reviewedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {reviewedCount} Reviewed
                          </span>
                        )}
                        {approvedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {approvedCount} Approved
                          </span>
                        )}
                        {pendingCount === 0 && reviewedCount === 0 && approvedCount === 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No submissions
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uniqueEmployees.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Employees</h2>
              </div>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No employees found</p>
              <p className="text-gray-400 text-sm mt-1">
                Employees will appear here once they submit appraisals
              </p>
            </div>
          </div>
        )}

      
      </div>
    </ManagerDashboardLayout>
  );
}
