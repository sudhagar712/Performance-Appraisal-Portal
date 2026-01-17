import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/EmployeeLayout/DashboardLayout";
import { useCreateDraftMutation } from "../../api/appraisalApi";
import { useAppSelector } from "../../app/hooks";
import { FileText, PlusCircle, CheckCircle, TrendingUp, Award } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [createDraft, { isLoading }] = useCreateDraftMutation();
  const { user } = useAppSelector((s) => s.auth);

  const startAppraisal = async () => {
    try {
      const res = await createDraft({ cycle: "2026-Q1" }).unwrap();
      navigate(`/employee/appraisal/${res.appraisal._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Draft create failed");
    }
  };

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
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Appraisals</p>
                <p className="text-3xl font-bold">Track</p>
              </div>
              <FileText className="w-10 h-10 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm mb-1">Performance</p>
                <p className="text-3xl font-bold">Grow</p>
              </div>
              <TrendingUp className="w-10 h-10 text-teal-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Reviews</p>
                <p className="text-3xl font-bold">Excel</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Achievements</p>
                <p className="text-3xl font-bold">Win</p>
              </div>
              <Award className="w-10 h-10 text-green-200" />
            </div>
          </div>
        </div>

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

      </div>
    </DashboardLayout>
  );
}
