import { useCallback } from "react";
import { getAvatarUrlFromSeed } from "../utils/helpers";

interface UserImageProps {
  profilePicture?: string;
  online_status?: boolean;
  fullName?: string;
}

const UserImage = ({
  profilePicture = "",
  online_status = false,
  fullName = "",
}: UserImageProps) => {
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src = getAvatarUrlFromSeed(fullName);
    },
    [fullName]
  );
  return (
    <div className="h-12 w-12 min-w-profileWidth flex justify-center items-center rounded-full border relative">
      <img
        src={profilePicture || getAvatarUrlFromSeed(fullName)}
        onError={handleError}
        alt={fullName}
        className="rounded-full aspect-square object-cover"
      />
      {online_status && (
        <div
          title="online"
          className="outline-2 outline outline-gray-0 h-3 w-3 rounded-full bg-green-active absolute -right-1 -bottom-2 -translate-y-1/2 -translate-x-1/2"
        ></div>
      )}
    </div>
  );
};

export default UserImage;
