import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useCreateDraftMutation } from "../../api/appraisalApi";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [createDraft, { isLoading }] = useCreateDraftMutation();

  const startAppraisal = async () => {
    try {
      const res = await createDraft({ cycle: "2026-Q1" }).unwrap();
      navigate(`/employee/appraisal/${res.appraisal._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      alert(error?.data?.message || "Draft create failed");
    }
  };

  return (
    <Layout title="Employee Dashboard">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">Start your Self Appraisal</h2>
        <p className="text-gray-600 mt-1">
          Add KRA + KPI and submit to manager.
        </p>

        <button
          onClick={startAppraisal}
          disabled={isLoading}
          className="mt-4 bg-teal-600 text-white px-5 py-2 rounded"
        >
          {isLoading ? "Creating..." : "Start Self Appraisal"}
        </button>
      </div>
    </Layout>
  );
}
