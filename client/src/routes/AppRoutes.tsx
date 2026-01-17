import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import SelfAppraisalForm from "../pages/employee/SelfAppraisalForm";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerReview from "../pages/manager/ManagerReview";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute roles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/appraisal/:id"
        element={
          <ProtectedRoute roles={["employee"]}>
            <SelfAppraisalForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/review/:id"
        element={
          <ProtectedRoute roles={["manager"]}>
            <ManagerReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute roles={["employee", "manager"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["employee", "manager"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
