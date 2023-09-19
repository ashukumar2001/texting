import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AnimatedRoutes from "./Components/Animated/AnimatedRoutes";
import useInitializeSockets from "./Hooks/useInitializeSockets";
import PWA from "./Components/PWA";

function App() {
  useInitializeSockets();

  return (
    <div className="App bg-gray-100 xl:w-4/12 lg:w-1/2 md:w-3/4 w-full mx-auto">
      <PWA />
      <ToastContainer
        hideProgressBar={true}
        theme="dark"
        toastClassName={() =>
          "rounded-md w-3/4 md:w-full ml-auto md:mb-3 md:mt-0 my-3 mr-3 text-gray-200 py-4 px-2 text-base font-medium bg-gray-500 relative flex justify-between overflow-hidden cursor-pointer"
        }
      />
      <AnimatedRoutes />
    </div>
  );
}

export default App;
