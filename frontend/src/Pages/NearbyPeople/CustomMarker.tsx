import L from "leaflet";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { getNameInitials } from "@/utils/helpers";
import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Button } from "@/Components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAppDispatch } from "@/Hooks/redux";
import { setCurrentInbox } from "../Chats/chatSlice";
import { Link } from "react-router-dom";

export interface CustomMarkerProps {
  latLng: L.LatLngExpression;
  user: { fullName?: string; profilePicture?: string; userName?: string };
  currentUser?: string;
  userId?: string;
}
const CustomMarker = ({
  latLng,
  user,
  userId,
  currentUser,
}: CustomMarkerProps) => {
  const isMyself = userId && currentUser && currentUser === userId;
  const dispatch = useAppDispatch();
  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: user.profilePicture!,
        iconSize: [24, 24],
        className: "rounded-full",
      }),
    [user]
  );
  return (
    <Marker position={latLng} icon={markerIcon}>
      <Popup>
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.profilePicture} alt={"@" + user.userName} />
            <AvatarFallback>{getNameInitials(user.fullName!)}</AvatarFallback>
          </Avatar>
          <p className="font-bold">
            {user.fullName}&nbsp;{isMyself ? "(You)" : ""}
          </p>
        </div>
        {!isMyself && (
          <div>
            <Button
              asChild
              onClick={() =>
                dispatch(
                  setCurrentInbox({
                    groupId: "",
                    inboxId: "",
                    participant: {
                      _id: userId,
                      fullName: user.fullName,
                      profilePicture: user.profilePicture,
                      userName: user.userName,
                    },
                    unreadMessageCount: 0,
                  })
                )
              }
              size="sm"
              variant="secondary"
              className="w-full"
            >
              <Link to={"/chats/" + user.userName!}>
                <MessageCircle size={16} strokeWidth={1.75} />
                &nbsp;Chat
              </Link>
            </Button>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default CustomMarker;
