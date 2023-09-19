import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../Hooks/redux";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const { isMobileVerified, isActivated } = useAppSelector(
    (state) => state.auth?.user
  );
  return !isMobileVerified || !isActivated ? (
    <Navigate to="/" replace={true} />
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoutes;
