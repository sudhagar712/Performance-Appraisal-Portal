import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { Role } from "../types";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: Role[];
}) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "manager" ? "/manager" : "/employee"}
        replace
      />
    );
  }

  return children;
}
