import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import {
  useGetAppraisalByIdQuery,
  useManagerReviewMutation,
} from "../../api/appraisalApi";
import { useState, useEffect, useRef, startTransition } from "react";
import type { KRA } from "../../types";

export default function ManagerReview() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAppraisalByIdQuery(id);
  const [submitReview] = useManagerReviewMutation();

  const [items, setItems] = useState<KRA[]>([]);
  const initialized = useRef(false);

  // Sync items when data loads (only once)
  // We need local state for editing, so syncing from API data is necessary
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
    value: number
  ) => {
    const updated = [...items];
    updated[kraIndex].kpis[kpiIndex].managerRating = value;
    setItems(updated);
  };

  const updateFeedback = (
    kraIndex: number,
    kpiIndex: number,
    value: string
  ) => {
    const updated = [...items];
    updated[kraIndex].kpis[kpiIndex].feedback = value;
    setItems(updated);
  };

  const onSubmit = async () => {
    try {
      await submitReview({ id, body: { items } }).unwrap();
      alert("Review submitted ✅");
      navigate("/manager");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      alert(error?.data?.message || "Review failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Layout title="Manager Review">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Employee: {data?.appraisal?.employeeId?.name}
            </h2>
            <p className="text-sm text-gray-500">
              Cycle: {data?.appraisal?.cycle}
            </p>
          </div>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => navigate("/manager")}
          >
            Back
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {items.map((kra, kraIndex) => (
            <div key={kraIndex} className="border p-4 rounded">
              <h3 className="font-semibold">
                {kra.kraTitle} ({kra.weightage}%)
              </h3>

              <div className="mt-3 space-y-3">
                {kra.kpis.map((kpi, kpiIndex) => (
                  <div key={kpiIndex} className="border p-3 rounded">
                    <p className="font-medium">{kpi.kpiTitle}</p>
                    <p className="text-sm text-gray-600">
                      Self Rating:{" "}
                      <span className="font-semibold">{kpi.selfRating}</span>
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <select
                        className="border p-2 rounded"
                        value={kpi.managerRating ?? ""}
                        onChange={(e) =>
                          updateManagerRating(
                            kraIndex,
                            kpiIndex,
                            Number(e.target.value)
                          )
                        }
                        aria-label="Manager Rating"
                        title="Select manager rating"
                      >
                        <option value="">Select rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>

                      {kpi.managerRating &&
                        kpi.managerRating !== kpi.selfRating && (
                          <input
                            className="border p-2 rounded flex-1"
                            placeholder="Feedback required (mismatch)"
                            value={kpi.feedback || ""}
                            onChange={(e) =>
                              updateFeedback(kraIndex, kpiIndex, e.target.value)
                            }
                          />
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onSubmit}
          className="mt-4 w-full bg-teal-600 text-white py-3 rounded"
        >
          Submit Review
        </button>
      </div>
    </Layout>
  );
}
