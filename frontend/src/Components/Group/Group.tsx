import moment from "moment";
import { MouseEventHandler, useId } from "react";
import { Link } from "react-router-dom";
import { inboxInterface } from "../../Pages/Chats/chatSlice";
import { getAvatarUrlFromSeed } from "../../utils/helpers";

interface groupProps extends inboxInterface {
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

const Group: React.FC<groupProps> = ({
  inboxId,
  group,
  participant,
  updatedAt,
  lastMessage,
  unreadMessageCount,
  onClick,
}) => {
  const key = useId();
  if (!participant?.userName) <></>;
  return (
    <Link
      key={`${participant?._id}-${key}`}
      state={{ inboxId, group, participant }}
      to={participant?.userName || ""}
      onClick={onClick}
    >
      <div className="w-full px-2 my-2 cursor-pointer">
        <div className="border-b border-gray-200 border-solid h-20  flex items-start justify-start p-3 ">
          <div className="h-12 w-12 min-w-profileWidth flex justify-center items-center rounded-full border relative">
            <img
              src={participant?.profilePicture}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAvatarUrlFromSeed(
                  participant?.fullName
                );
              }}
              alt={participant?.fullName}
              className="w-full h-full rounded-full"
            />
            {/* <div className="outline-2 outline outline-gray-0 h-3 w-3 rounded-full bg-green-active absolute -right-1 -bottom-2 -translate-y-1/2 -translate-x-1/2"></div> */}
          </div>
          <div className="flex-col ml-3 mr-2 grow">
            <div className="flex grow justify-between">
              <p className="text-gray-600 text-base font-bold tracking-wider mb-1">
                {participant?.fullName}
              </p>
              {(updatedAt || lastMessage?.content?.timestamp) && (
                <p
                  className={`${
                    unreadMessageCount ? "text-gray-600" : "text-para-100"
                  } text-xs font-light tracking-wider`}
                >
                  {moment(lastMessage?.content?.timestamp || updatedAt).format(
                    "h:mm"
                  )}
                </p>
              )}
            </div>
            {lastMessage && (
              <div className="flex items-center justify-between w-full">
                <p
                  className={`${
                    unreadMessageCount && unreadMessageCount > 0
                      ? "text-gray-600 font-normal"
                      : "text-para-100 font-light"
                  } text-sm break-words break-all tracking-wider w-60 inline-block max-w-xs sm:w-11/12 truncate`}
                >
                  {lastMessage?.content?.messageText}
                </p>
                {Boolean(unreadMessageCount) && (
                  <div
                    className="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center
                  "
                  >
                    <span className="text-white text-xs font-semibold">
                      {unreadMessageCount}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Group;
