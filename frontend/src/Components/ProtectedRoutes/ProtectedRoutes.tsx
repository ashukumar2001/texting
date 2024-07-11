import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../Hooks/redux";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const { isUserAuthenticated } = useAppSelector((state) => state.auth?.user);
  return !isUserAuthenticated ? (
    <Navigate to="/" replace={true} />
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoutes;
