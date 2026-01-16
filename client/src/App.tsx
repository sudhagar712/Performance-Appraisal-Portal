import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useGetCurrentUserQuery } from "./api/authApi";
import { useAppDispatch } from "./app/hooks";
import { setCredentials, clearCredentials } from "./features/auth/authSlice";
import Loader from "./components/Loader";

export default function App() {
  const dispatch = useAppDispatch();

  const { data, isError, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data.user));
    }
    if (isError) {
      dispatch(clearCredentials());
    }
  }, [data, isError, dispatch]);

  
  if (isLoading) {
    return <Loader text="Checking session..." />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
