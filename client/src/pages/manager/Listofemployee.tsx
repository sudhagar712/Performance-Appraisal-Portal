import { useManagerSubmissionsQuery } from "../../api/appraisalApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Users, User } from "lucide-react";

interface EmployeeWithProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const Listofemployee = () => {
  const { data, isLoading } = useManagerSubmissionsQuery();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Extract unique employees from submissions
  const uniqueEmployees = Array.from(
    new Map(
      (data?.submissions || [])
        .filter((submission) => submission.employeeId)
        .map((submission) => [
          submission.employeeId!._id,
          {
            _id: submission.employeeId!._id,
            name: submission.employeeId!.name,
            email: submission.employeeId!.email,
            profileImage: (submission.employeeId as EmployeeWithProfile)?.profileImage,
          } as EmployeeWithProfile,
        ])
    ).values()
  );

  const handleImageError = (profileImage: string) => {
    setImageErrors((prev) => ({ ...prev, [profileImage]: true }));
  };

  const getImageUrl = (profileImage?: string) => {
    if (!profileImage || imageErrors[profileImage]) return null;
    return profileImage.startsWith("http")
      ? profileImage
      : `${import.meta.env.VITE_API_URL}${profileImage}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">All Employees</h2>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Employees</h2>
          <p className="text-sm text-gray-500">
            {uniqueEmployees.length} {uniqueEmployees.length === 1 ? "employee" : "employees"}
          </p>
        </div>
      </div>

      {uniqueEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {uniqueEmployees.map((employee) => {
            const imageUrl = getImageUrl(employee.profileImage);
            const hasImageError =
              (employee.profileImage && imageErrors[employee.profileImage]) ||
              !imageUrl;

            return (
              <div
                key={employee._id}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => {
                  // Navigate to employee details or filter by employee
                  const employeeSubmissions = data?.submissions.filter(
                    (s) => s.employeeId?._id === employee._id
                  );
                  if (employeeSubmissions && employeeSubmissions.length > 0) {
                    navigate(
                      `/manager/review/${employeeSubmissions[0]._id}`
                    );
                  }
                }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="relative mb-4">
                    {imageUrl && !hasImageError ? (
                      <img
                        src={imageUrl}
                        alt={employee.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-purple-200 transition-colors"
                        onError={() =>
                          employee.profileImage && handleImageError(employee.profileImage)
                        }
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:from-purple-500 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all border-4 border-white">
                        {employee.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>

                  {/* Employee Name */}
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-purple-600 transition-colors">
                    {employee.name}
                  </h3>

                  {/* Email */}
                  <p className="text-sm text-gray-500 truncate w-full mb-3">
                    {employee.email}
                  </p>

                  {/* Submission Count Badge */}
                  <div className="w-full">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {data?.submissions.filter(
                        (s) => s.employeeId?._id === employee._id
                      ).length || 0}{" "}
                      {data?.submissions.filter(
                        (s) => s.employeeId?._id === employee._id
                      ).length === 1
                        ? "submission"
                        : "submissions"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No employees found</p>
          <p className="text-gray-400 text-sm mt-1">
            Employees will appear here once they submit appraisals
          </p>
        </div>
      )}
    </div>
  );
};

export default Listofemployee;