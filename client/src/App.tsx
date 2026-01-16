import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useGetCurrentUserQuery } from "./api/authApi";
import { useAppDispatch } from "./app/hooks";
import { setCredentials, clearCredentials } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useAppDispatch();

  const { data, isError } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data.user));
    }
    if (isError) {
      dispatch(clearCredentials());
    }
  }, [data, isError, dispatch]);

 
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
