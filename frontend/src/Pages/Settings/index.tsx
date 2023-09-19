import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/PageHeader";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Settings" handleGoBack={() => navigate(-1)} />
    </>
  );
};

export default Settings;
