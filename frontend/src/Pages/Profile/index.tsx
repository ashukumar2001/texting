import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/PageHeader";
import useAuth from "../../Hooks/useAuth";
import { getAvatarUrlFromSeed } from "../../utils/helpers";

const Profile = () => {
  const navigate = useNavigate();
  const { profilePicture, fullName, email, userName } = useAuth();
  return (
    <>
      <PageHeader title="Profile" handleGoBack={() => navigate(-1)} />
      <div className="my-6 flex flex-col justify-center items-center">
        <div className="h-24 w-24 min-w-profileWidth flex justify-center items-center rounded-full border relative mx-auto mb-3">
          <img
            src={profilePicture}
            className="w-full h-full rounded-full"
            alt={fullName}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                getAvatarUrlFromSeed(fullName);
            }}
          />
        </div>

        <p className="font-bold text-gray-500 my-1  text-lg tracking-wide">
          {fullName}
        </p>
        <p className="font-bold text-gray-500 my-1  text-lg tracking-wide">
          @{userName}
        </p>
        <p className="font-bold text-gray-500 my-1  text-lg tracking-wide">
          {email}
        </p>
      </div>
    </>
  );
};

export default Profile;
