import { User } from "../Components/AuthSteps/authSlice";
import { useAppSelector } from "./redux";

const useAuth = (): User => {
  const user = useAppSelector((state) => state.auth.user);

  return user;
};
export default useAuth;
