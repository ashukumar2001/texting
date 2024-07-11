import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Hooks/redux";
import { inboxInterface, setCurrentInbox } from "../../Pages/Chats/chatSlice";
import { getAvatarUrlFromSeed } from "../../utils/helpers";
const GroupSearchResultItem = ({
  group,
  inboxId,
  lastMessage,
  participant,
}: inboxInterface) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleClickOnUser = async () => {
    navigate(participant?.userName || "");
    dispatch(
      setCurrentInbox({
        participant,
        groupId: group,
        inboxId,
      })
    );
  };

  return (
    <>
      <div
        key={participant?._id}
        className="w-full px-2 my-2 cursor-pointer"
        onClick={handleClickOnUser}
      >
        <div className="border-b border-gray-200 border-solid h-20  flex items-center justify-start p-3 ">
          <div className="h-12 w-12 flex justify-center items-center rounded-full border relative">
            <img
              src={getAvatarUrlFromSeed(participant?.fullName)}
              alt={participant?.fullName}
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="flex-col ml-3 mr-2 grow">
            <div className="flex grow justify-between">
              <p className="text-gray-600 text-base font-bold tracking-wider mb-1">
                {participant?.fullName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupSearchResultItem;
