import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/EmployeeLayout/DashboardLayout";
import AppraisalStatusTable from "../../components/EmployeeLayout/AppraisalStatusTable";
import { useCreateDraftMutation, useEmployeeAppraisalsQuery } from "../../api/appraisalApi";
import { useAppSelector } from "../../app/hooks";
import { FileText, PlusCircle, CheckCircle, TrendingUp, Award, Clock, User } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";


export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [createDraft, { isLoading }] = useCreateDraftMutation();
  const { user } = useAppSelector((s) => s.auth);
  const { data: appraisalsData, isLoading: appraisalsLoading } = useEmployeeAppraisalsQuery();

  const appraisals = appraisalsData?.appraisals || [];

  //...........................current appraisal..........................................
  const currentAppraisal = appraisals.length > 0 ? appraisals[0] : null;
  const goalsProgress = currentAppraisal 
    ? Math.round((currentAppraisal.items.reduce((sum, item) => {
        const completedKPIs = item.kpis.filter(kpi => kpi.selfRating > 0).length;
        return sum + (completedKPIs / item.kpis.length) * (item.weightage / 100);
      }, 0)) * 100)
    : 0;
  const managerRating = currentAppraisal?.finalScoreManager || 0;
  const pendingTasks = appraisals.filter(a => a.status === "draft").length;

 
 const overallScore = currentAppraisal
  ? (currentAppraisal.status === "reviewed" || currentAppraisal.status === "approved") &&
    currentAppraisal.finalScoreManager > 0
    ? Math.round(currentAppraisal.finalScoreManager)
    : currentAppraisal.finalScoreEmployee > 0
    ? Math.round(currentAppraisal.finalScoreEmployee)
    : 0
  : 0;


  // ...................................api for start appraisal..........................................
  const startAppraisal = async () => {
    try {
      const res = await createDraft({ cycle: "2026-Q1" }).unwrap();
      navigate(`/employee/appraisal/${res.appraisal._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Draft create failed");
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return { text: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-300" };
      case "submitted":
        return { text: "In Review", color: "bg-blue-100 text-blue-700 border-blue-300" };
      case "reviewed":
        return { text: "Reviewed", color: "bg-purple-100 text-purple-700 border-purple-300" };
      case "approved":
        return { text: "Approved", color: "bg-green-100 text-green-700 border-green-300" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-700 border-gray-300" };
    }
  };

  if (appraisalsLoading) return <Loader />;

  return (
    <DashboardLayout title="Employee Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100">Manage your performance appraisals and track your progress</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* My Appraisal Status */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">My Appraisal Status</p>
                {currentAppraisal ? (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-lg font-bold">{getStatusBadge(currentAppraisal.status).text}</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold mt-1">No Active</p>
                )}
                {currentAppraisal && (
                  <p className="text-xs text-blue-200 mt-1">Cycle: {currentAppraisal.cycle}</p>
                )}
              </div>
              <FileText className="w-10 h-10 text-blue-200" />
            </div>
          </div>

          {/* Appraisal Completion */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Appraisal Completion</p>
                <div className="relative w-16 h-16 mt-2">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="white"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(goalsProgress / 100) * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{goalsProgress}%</span>
                  </div>
                </div>
                <p className="text-xs text-green-100 mt-1">Achieved</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-200" />
            </div>
          </div>

          {/* Manager Feedback */}
          <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Manager Feedback</p>
                <div className="flex items-center gap-2 mt-2">
                  {user?.profileImage ? (
                    <img
                      src={
                        user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `${import.meta.env.VITE_API_URL}${user.profileImage}`
                      }
                      alt="Manager"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        console.error("Image load error:", user.profileImage);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {managerRating > 0 ? `${Math.round(managerRating)}/100` : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              </div>
              <Award className="w-10 h-10 text-gray-300" />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Pending Tasks</p>
                <div className="relative w-16 h-16 mt-2">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#f3f4f6"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#f97316"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(pendingTasks / 5) * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-800">{pendingTasks}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tasks</p>
              </div>
              <Clock className="w-10 h-10 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Appraisal Status Section */}
        <AppraisalStatusTable appraisals={appraisals} />

        {/* My Goals & Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
         {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            Quick Actions
          </h2>
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Start Your Self Appraisal
            </h3>
            <p className="text-gray-600 mb-4">
              Create a new appraisal cycle and add your KRAs and KPIs to submit for review.
            </p>
            <button
              onClick={startAppraisal}
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              {isLoading ? "Creating..." : "Start New Appraisal"}
            </button>
          </div>
        </div>



          {/* Performance Overview */}
         <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">
    Performance Overview
  </h2>

  <div className="flex items-center justify-center">
    <div className="relative w-48 h-48">
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="#10b981"
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${(overallScore / 100) * 502.6} 502.6`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-800">
          {overallScore}
        </span>
        <span className="text-sm text-gray-500">Overall Score</span>

        {/* ✅ Optional label */}
        <span className="text-xs text-gray-400 mt-1">
          out of 100
        </span>
      </div>
    </div>
  </div>
</div>

        </div>

       
      </div>
    </DashboardLayout>
  );
}
