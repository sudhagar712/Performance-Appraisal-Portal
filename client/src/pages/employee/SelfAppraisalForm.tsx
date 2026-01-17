import { useEffect, useState, useRef, startTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/EmployeeLayout/DashboardLayout";
import Loader from "../../components/Loader";
import {
  useGetAppraisalByIdQuery,
  useSaveDraftMutation,
  useSubmitSelfMutation,
} from "../../api/appraisalApi";
import type { KRA } from "../../types";
import { ArrowLeft, Save, ArrowRight, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SelfAppraisalForm() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAppraisalByIdQuery(id);
  const [saveDraft, { isLoading: isSaving }] = useSaveDraftMutation();
  const [submitSelf, { isLoading: isSubmitting }] = useSubmitSelfMutation();

  const [items, setItems] = useState<KRA[]>([]);
  const initialized = useRef(false);

  // Sync items when data loads (only once)
  useEffect(() => {
    if (data?.appraisal?.items && !initialized.current) {
      initialized.current = true;
      startTransition(() => {
        setItems(data.appraisal.items);
      });
    }
  }, [data]);

  const totalWeight = items.reduce((s, i) => s + Number(i.weightage || 0), 0);

  const addKRA = () => {
    setItems((prev) => [
      ...prev,
      { kraTitle: "", weightage: 0, kpis: [{ kpiTitle: "", selfRating: 1 }] },
    ]);
  };

  const addKPI = (kraIndex: number) => {
    const updated = [...items];
    updated[kraIndex].kpis.push({ kpiTitle: "", selfRating: 1 });
    setItems(updated);
  };

  const updateKRA = (
    index: number,
    field: keyof KRA,
    value: string | number
  ) => {
    const updated = [...items];
    // @ts-expect-error - Dynamic field assignment is safe here
    updated[index][field] = field === "weightage" ? Number(value) : value;
    setItems(updated);
  };

  const updateKPI = (
    kraIndex: number,
    kpiIndex: number,
    field: "kpiTitle" | "selfRating",
    value: string | number
  ) => {
    const updated = [...items];
    // @ts-expect-error - Dynamic field assignment is safe here
    updated[kraIndex].kpis[kpiIndex][field] =
      field === "selfRating" ? Number(value) : value;
    setItems(updated);
  };

  const removeKRA = (index: number) =>
    setItems(items.filter((_, i) => i !== index));
  
  const removeKPI = (kraIndex: number, kpiIndex: number) => {
    const updated = [...items];
    updated[kraIndex].kpis = updated[kraIndex].kpis.filter(
      (_, i) => i !== kpiIndex
    );
    setItems(updated);
  };

  const onSave = async () => {
    const tid = String(id || "").trim();
    if (!tid || tid.toLowerCase() === "undefined") {
      toast.error("Invalid appraisal. Please go back and create a new appraisal from the dashboard.");
      return;
    }
    if (totalWeight !== 100) {
      toast.error("Total weightage must be exactly 100%");
      return;
    }
    if (items.some(kra => !kra.kraTitle.trim())) {
      toast.error("Please fill all KRA titles");
      return;
    }
    try {
      await saveDraft({ id: tid, body: { items } }).unwrap();
      toast.success("Draft saved successfully!");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      const status = error?.status;
      const msg = error?.data?.message || "";
      if (status === 404 || String(msg).toLowerCase().includes("not found")) {
        toast.error("Appraisal not found. Please create a new appraisal from the dashboard.");
      } else if (status === 403 || String(msg).toLowerCase().includes("not authorized")) {
        toast.error("You are not authorized to update this appraisal.");
      } else {
        toast.error(msg || "Save failed");
      }
    }
  };

  const onSubmit = async () => {
    if (totalWeight !== 100) {
      toast.error("Total weightage must be exactly 100%");
      return;
    }
    if (items.some(kra => !kra.kraTitle.trim())) {
      toast.error("Please fill all KRA titles");
      return;
    }
    if (items.some(kra => kra.kpis.some(kpi => !kpi.kpiTitle.trim() || !kpi.selfRating))) {
      toast.error("Please fill all KPI titles and ratings");
      return;
    }
    try {
      await submitSelf(id).unwrap();
      toast.success("Appraisal submitted successfully!");
      navigate("/employee");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Submit failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <DashboardLayout title="Employee Self Appraisal">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 sm:px-6 py-4 sm:py-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Employee Self Appraisal</h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                Cycle: <span className="font-semibold">{data?.appraisal?.cycle || "2026-Q1"}</span>
              </p>
            </div>
            <button
              onClick={() => navigate("/employee")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm sm:text-base self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Weightage Summary */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-600">Total Weightage:</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-base sm:text-lg font-bold ${
                  totalWeight === 100
                    ? "text-green-600"
                    : totalWeight > 100
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {totalWeight}/100%
              </span>
              {totalWeight !== 100 && (
                <AlertCircle className={`w-4 h-4 ${
                  totalWeight > 100 ? "text-red-600" : "text-orange-600"
                }`} />
              )}
            </div>
          </div>
        </div>

        {/* Appraisal Form */}
        <div className="p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">No KRAs added yet</p>
              <button
                onClick={addKRA}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base font-medium shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add KRA
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {items.map((kra, kraIndex) => (
                <div
                  key={kraIndex}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* KRA Header */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            className="text-base sm:text-lg font-semibold text-gray-800 bg-transparent border-none outline-none w-full placeholder-gray-400 focus:ring-2 focus:ring-green-500 rounded px-2 py-1 -ml-2"
                            placeholder="Enter KRA Title (e.g., Quality of Work)"
                            value={kra.kraTitle}
                            onChange={(e) =>
                              updateKRA(kraIndex, "kraTitle", e.target.value)
                            }
                            aria-label={`KRA ${kraIndex + 1} title`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Weightage:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-16 sm:w-20 px-2 py-1.5 text-sm font-semibold text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={kra.weightage}
                            aria-label={`KRA ${kraIndex + 1} weightage percentage`}
                            onChange={(e) =>
                              updateKRA(kraIndex, "weightage", e.target.value)
                            }
                          />
                          <span className="text-xs sm:text-sm text-gray-600">%</span>
                        </div>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeKRA(kraIndex)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            title="Remove KRA"
                            aria-label="Remove KRA"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* KPI Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                            <div className="flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            KPI
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                            KPI Value
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28 sm:w-32">
                            Self Rating
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {kra.kpis.map((kpi, kpiIndex) => (
                          <tr key={kpiIndex} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={!!kpi.kpiTitle.trim() && !!kpi.selfRating}
                                  readOnly
                                  aria-label={`KPI ${kpiIndex + 1} completion status`}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <input
                                type="text"
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter KPI title"
                                value={kpi.kpiTitle}
                                aria-label={`KPI ${kpiIndex + 1} title`}
                                onChange={(e) =>
                                  updateKPI(
                                    kraIndex,
                                    kpiIndex,
                                    "kpiTitle",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center justify-center">
                                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded border border-green-200 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                                  {kpi.selfRating || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center justify-center">
                                <select
                                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={kpi.selfRating || 1}
                                  aria-label={`KPI ${kpiIndex + 1} self rating`}
                                  onChange={(e) =>
                                    updateKPI(
                                      kraIndex,
                                      kpiIndex,
                                      "selfRating",
                                      e.target.value
                                    )
                                  }
                                >
                                  {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center justify-center">
                                {kra.kpis.length > 1 && (
                                  <button
                                    onClick={() => removeKPI(kraIndex, kpiIndex)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Remove KPI"
                                    aria-label="Remove KPI"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add KPI Button */}
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => addKPI(kraIndex)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors font-medium"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Add KPI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={addKRA}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Add KRA
            </button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={onSave}
                disabled={isSaving || totalWeight !== 100}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={onSubmit}
                disabled={isSubmitting || totalWeight !== 100}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Submit Appraisal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
