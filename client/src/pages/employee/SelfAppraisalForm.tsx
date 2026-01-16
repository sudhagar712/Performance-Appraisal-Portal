import { useEffect, useState, useRef, startTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import {
  useGetAppraisalByIdQuery,
  useSaveDraftMutation,
  useSubmitSelfMutation,
} from "../../api/appraisalApi";
import type { KRA } from "../../types";

export default function SelfAppraisalForm() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAppraisalByIdQuery(id);
  const [saveDraft] = useSaveDraftMutation();
  const [submitSelf] = useSubmitSelfMutation();

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
    try {
      await saveDraft({ id, body: { items } }).unwrap();
      alert("Draft saved ✅");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      alert(error?.data?.message || "Save failed");
    }
  };

  const onSubmit = async () => {
    try {
      await submitSelf(id).unwrap();
      alert("Submitted ✅");
      navigate("/employee");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      alert(error?.data?.message || "Submit failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Layout title="Self Appraisal Form">
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Cycle: {data?.appraisal?.cycle}
            </p>
            <p className="text-sm">
              Total Weightage:{" "}
              <span
                className={
                  totalWeight === 100
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {totalWeight}/100
              </span>
            </p>
          </div>
          <button
            onClick={() => navigate("/employee")}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {items.map((kra, kraIndex) => (
            <div key={kraIndex} className="border p-4 rounded-lg">
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  className="border p-2 rounded w-full md:w-1/2"
                  placeholder="KRA Title"
                  value={kra.kraTitle}
                  onChange={(e) =>
                    updateKRA(kraIndex, "kraTitle", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded w-full md:w-32"
                  type="number"
                  placeholder="Weightage"
                  value={kra.weightage}
                  onChange={(e) =>
                    updateKRA(kraIndex, "weightage", e.target.value)
                  }
                />
                <button
                  onClick={() => removeKRA(kraIndex)}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Delete KRA
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {kra.kpis.map((kpi, kpiIndex) => (
                  <div key={kpiIndex} className="flex flex-wrap gap-2">
                    <input
                      className="border p-2 rounded w-full md:w-1/2"
                      placeholder="KPI Title"
                      value={kpi.kpiTitle}
                      onChange={(e) =>
                        updateKPI(
                          kraIndex,
                          kpiIndex,
                          "kpiTitle",
                          e.target.value
                        )
                      }
                    />
                    <select
                      className="border p-2 rounded w-full md:w-32"
                      value={kpi.selfRating}
                      onChange={(e) =>
                        updateKPI(
                          kraIndex,
                          kpiIndex,
                          "selfRating",
                          e.target.value
                        )
                      }
                      aria-label="Self Rating"
                      title="Select self rating"
                    >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeKPI(kraIndex, kpiIndex)}
                      className="px-3 py-2 border rounded"
                    >
                      Remove KPI
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addKPI(kraIndex)}
                className="mt-2 px-3 py-2 bg-gray-100 rounded"
              >
                + Add KPI
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={addKRA}
            className="px-5 py-2 bg-teal-600 text-white rounded"
          >
            + Add KRA
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 bg-blue-600 text-white rounded"
          >
            Save Draft
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
}
