import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useManagerSubmissionsQuery } from "../../api/appraisalApi";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const { data, isLoading } = useManagerSubmissionsQuery();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  return (
    <Layout title="Manager Dashboard">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">Submitted Appraisals</h2>

        <div className="mt-4 space-y-3">
          {data?.submissions?.map((a) => (
            <div
              key={a._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{a.employeeId?.name}</p>
                <p className="text-sm text-gray-500">
                  {a.cycle} • {a.status}
                </p>
              </div>

              <button
                onClick={() => navigate(`/manager/review/${a._id}`)}
                className="px-4 py-2 bg-teal-600 text-white rounded"
              >
                Review
              </button>
            </div>
          ))}
        </div>

        {!data?.submissions?.length && (
          <p className="text-gray-500 mt-3">No submissions yet</p>
        )}
      </div>
    </Layout>
  );
}
