import Layout from "../components/Layout";
import Loader from "../components/Loader";
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
} from "../api/notificationApi";

export default function Notifications() {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkReadMutation();

  if (isLoading) return <Loader />;

  return (
    <Layout title="Notifications">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">Your Notifications</h2>

        <div className="mt-4 space-y-3">
          {data?.notifications?.map((n) => (
            <div
              key={n._id}
              className={`border p-4 rounded ${
                n.isRead ? "bg-gray-50" : "bg-white"
              }`}
            >
              <p className="font-medium">{n.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>

              {!n.isRead && (
                <button
                  onClick={() => markRead(n._id)}
                  className="mt-2 px-3 py-1 text-sm border rounded"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}

          {!data?.notifications?.length && (
            <p className="text-gray-500">No notifications</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
