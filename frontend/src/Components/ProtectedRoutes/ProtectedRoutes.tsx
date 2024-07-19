import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../Hooks/redux";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const isUserAuthenticated = useAppSelector(
    (state) => state.auth?.user.isUserAuthenticated
  );
  const isSocketConnected = useAppSelector((state) => state.socket.connected);
  return !isUserAuthenticated ? (
    <Navigate to="/" replace={true} />
  ) : (
    <>{isSocketConnected ? children : <div>Loading...</div>}</>
  );
};

export default ProtectedRoutes;
