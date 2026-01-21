import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import type { Appraisal } from "../../types/appraisal.types";

interface AppraisalStatusTableProps {
  appraisals: Appraisal[];
}

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

export default function AppraisalStatusTable({ appraisals }: AppraisalStatusTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Appraisal Status
      </h2>
      {appraisals.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No appraisals found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cycle</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Your Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Manager Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {appraisals.map((appraisal) => {
                const statusBadge = getStatusBadge(appraisal.status);
                return (
                  <tr key={appraisal._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800">{appraisal.cycle}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">
                        {appraisal.finalScoreEmployee > 0 ? `${appraisal.finalScoreEmployee.toFixed(1)}/5` : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">
                        {appraisal.finalScoreManager > 0 ? `${appraisal.finalScoreManager.toFixed(1)}/5` : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600 text-sm">
                        {new Date(appraisal.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/employee/appraisal/${appraisal._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

