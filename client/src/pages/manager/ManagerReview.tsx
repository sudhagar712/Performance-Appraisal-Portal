import { useNavigate, useParams } from "react-router-dom";
import ManagerDashboardLayout from "../../components/ManagerLayout/ManagerDashboardLayout";
import Loader from "../../components/Loader";
import {
  useGetAppraisalByIdQuery,
  useManagerReviewMutation,
} from "../../api/appraisalApi";
import { useState, useEffect, useRef, startTransition } from "react";
import type { KRA } from "../../types";
import { ArrowLeft, Star, MessageSquare, User, Calendar, FileCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ManagerReview() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAppraisalByIdQuery(id);
  const [submitReview, { isLoading: isSubmitting }] = useManagerReviewMutation();

  const [items, setItems] = useState<KRA[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (data?.appraisal?.items && !initialized.current) {
      initialized.current = true;
      startTransition(() => {
        setItems(data.appraisal.items);
      });
    }
  }, [data]);

  const updateManagerRating = (
    kraIndex: number,
    kpiIndex: number,
    value: number | undefined
  ) => {
    setItems((prev) =>
      prev.map((kra, i) =>
        i !== kraIndex
          ? kra
          : {
              ...kra,
              kpis: kra.kpis.map((kpi, j) =>
                j !== kpiIndex ? kpi : { ...kpi, managerRating: value }
              ),
            }
      )
    );
  };

  const updateFeedback = (
    kraIndex: number,
    kpiIndex: number,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((kra, i) =>
        i !== kraIndex
          ? kra
          : {
              ...kra,
              kpis: kra.kpis.map((kpi, j) =>
                j !== kpiIndex ? kpi : { ...kpi, feedback: value }
              ),
            }
      )
    );
  };

  const onSubmit = async () => {
    for (const kra of items) {
      for (const kpi of kra.kpis) {
        if (!kpi.managerRating) {
          toast.error("Manager rating is required for all KPIs.");
          return;
        }
        if (kpi.selfRating !== kpi.managerRating && !(kpi.feedback || "").trim()) {
          toast.error("Feedback is required when your rating differs from self-rating.");
          return;
        }
      }
    }
    // Payload with managerRating and feedback explicitly for each KPI (for POST)
    const body = {
      items: items.map((kra) => ({
        kraTitle: kra.kraTitle,
        weightage: kra.weightage,
        kpis: kra.kpis.map((kpi) => ({
          kpiTitle: kpi.kpiTitle,
          selfRating: kpi.selfRating,
          managerRating: Number(kpi.managerRating),
          feedback: kpi.feedback != null ? String(kpi.feedback).trim() : "",
        })),
      })),
    };
    try {
      await submitReview({ id, body }).unwrap();
      toast.success("Review submitted successfully!");
      navigate("/manager");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Review failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <ManagerDashboardLayout title="Manager Review">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pb-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 shrink-0 text-teal-200" />
                <h2 className="text-lg sm:text-xl font-bold truncate">
                  {data?.appraisal?.employeeId?.name || "Employee"}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-teal-100 text-sm">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Cycle: {data?.appraisal?.cycle}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/manager")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* KRA Sections */}
        <div className="space-y-5">
          {items.map((kra, kraIndex) => (
            <div
              key={kraIndex}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-100 px-4 sm:px-6 py-3">
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                  {kra.kraTitle}
                  <span className="ml-2 text-teal-600 font-medium">({kra.weightage}%)</span>
                </h3>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {kra.kpis.map((kpi, kpiIndex) => {
                  const needsFeedback = kpi.managerRating != null && kpi.managerRating !== kpi.selfRating;
                  return (
                    <div
                      key={kpiIndex}
                      className="rounded-xl border border-gray-200 p-4 sm:p-5 bg-gray-50/50 hover:bg-gray-50/80 transition-colors"
                    >
                      <p className="font-medium text-gray-800 mb-3">{kpi.kpiTitle}</p>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm text-gray-500">Self Rating:</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          {kpi.selfRating}
                        </span>
                      </div>

                      {/* Manager Rating - always visible */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager Rating <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full sm:max-w-[180px] border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                          value={kpi.managerRating ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            updateManagerRating(kraIndex, kpiIndex, v === "" ? undefined : Number(v));
                          }}
                          aria-label="Manager Rating"
                        >
                          <option value="">rating (1–5)</option>
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      {/* Feedback - always visible */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <MessageSquare className="w-4 h-4 text-teal-600" />
                          Feedback
                          {needsFeedback && (
                            <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-normal">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Required (rating differs)
                            </span>
                          )}
                        </label>
                        <textarea
                          className="w-full min-h-[88px] border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y transition-shadow"
                          placeholder={needsFeedback ? "Please provide feedback for the rating difference..." : "Optional feedback for the employee..."}
                          value={kpi.feedback || ""}
                          onChange={(e) => updateFeedback(kraIndex, kpiIndex, e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 sticky bottom-4 sm:relative sm:bottom-0">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <FileCheck className="w-5 h-5" />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </ManagerDashboardLayout>
  );
}
