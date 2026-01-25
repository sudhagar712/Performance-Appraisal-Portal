import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, Calendar, TrendingUp, Eye, ChevronRight } from "lucide-react";
import type { Appraisal } from "../../types/appraisal.types";
import FeedbackModal from "./FeedbackModal";

interface AppraisalStatusTableProps {
  appraisals: Appraisal[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return { text: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-300", dot: "bg-yellow-500" };
    case "submitted":
      return { text: "In Review", color: "bg-blue-100 text-blue-700 border-blue-300", dot: "bg-blue-500" };
    case "reviewed":
      return { text: "Reviewed", color: "bg-purple-100 text-purple-700 border-purple-300", dot: "bg-purple-500" };
    case "approved":
      return { text: "Approved", color: "bg-green-100 text-green-700 border-green-300", dot: "bg-green-500" };
    default:
      return { text: status, color: "bg-gray-100 text-gray-700 border-gray-300", dot: "bg-gray-500" };
  }
};

// Get all feedbacks from appraisal items
const getFeedbacks = (appraisal: Appraisal) => {
  const feedbacks: { kraTitle: string; kpiTitle: string; feedback: string }[] = [];
  appraisal.items.forEach((kra) => {
    kra.kpis.forEach((kpi) => {
      if (kpi.feedback?.trim()) {
        feedbacks.push({
          kraTitle: kra.kraTitle,
          kpiTitle: kpi.kpiTitle,
          feedback: kpi.feedback,
        });
      }
    });
  });
  return feedbacks;
};

export default function AppraisalStatusTable({ appraisals }: AppraisalStatusTableProps) {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState<{
    cycle: string;
    feedbacks: { kraTitle: string; kpiTitle: string; feedback: string }[];
  } | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Appraisal Status
        </h2>

        {appraisals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No appraisals found</p>
            <p className="text-gray-400 text-sm mt-1">Start a new appraisal to see it here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 rounded-lg">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-lg">Cycle</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appraisals.map((appraisal) => {
                    const statusBadge = getStatusBadge(appraisal.status);
                    const feedbacks = getFeedbacks(appraisal);
                    const hasFeedback = feedbacks.length > 0;

                    return (
                      <tr key={appraisal._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-800">{appraisal.cycle}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              {appraisal.finalScoreEmployee > 0 ? `${Math.round(appraisal.finalScoreEmployee)}/100` : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              {appraisal.finalScoreManager > 0 ? `${Math.round(appraisal.finalScoreManager)}/100` : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {hasFeedback ? (
                            <button
                              onClick={() => setSelectedFeedback({ cycle: appraisal.cycle, feedbacks })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-medium transition-all hover:shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {feedbacks.length} {feedbacks.length === 1 ? "Feedback" : "Feedbacks"}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No feedback</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date(appraisal.createdAt).toLocaleDateString("en-GB")}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => navigate(`/employee/appraisal/${appraisal._id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {appraisals.map((appraisal) => {
                const statusBadge = getStatusBadge(appraisal.status);
                const feedbacks = getFeedbacks(appraisal);
                const hasFeedback = feedbacks.length > 0;

                return (
                  <div
                    key={appraisal._id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{appraisal.cycle}</h3>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(appraisal.createdAt).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-600 font-medium mb-1">Your Score</p>
                        <p className="text-xl font-bold text-blue-700">
                          {appraisal.finalScoreEmployee > 0 ? `${Math.round(appraisal.finalScoreEmployee)}` : "-"}
                          <span className="text-sm font-normal text-blue-500">/100</span>
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-green-600 font-medium mb-1">Manager Score</p>
                        <p className="text-xl font-bold text-green-700">
                          {appraisal.finalScoreManager > 0 ? `${Math.round(appraisal.finalScoreManager)}` : "-"}
                          <span className="text-sm font-normal text-green-500">/100</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {hasFeedback && (
                        <button
                          onClick={() => setSelectedFeedback({ cycle: appraisal.cycle, feedbacks })}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-medium transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {feedbacks.length} {feedbacks.length === 1 ? "Feedback" : "Feedbacks"}
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/employee/appraisal/${appraisal._id}`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all hover:shadow-md"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={selectedFeedback !== null}
        onClose={() => setSelectedFeedback(null)}
        cycle={selectedFeedback?.cycle || ""}
        feedbacks={selectedFeedback?.feedbacks || []}
      />
    </>
  );
}
