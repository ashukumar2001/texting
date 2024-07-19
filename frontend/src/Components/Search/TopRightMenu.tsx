import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { LogOut, MapPin, MoreVertical, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Hooks/redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { logOut } from "../AuthSteps/authSlice";
import { socket } from "@/ws/socket";
import { getNameInitials } from "@/utils/helpers";
const TopRightMenu = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreVertical size={20} strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            navigate("/profile");
          }}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="flex gap-2 items-center truncate">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>
                    {getNameInitials(user.userName || "")}
                  </AvatarFallback>
                </Avatar>
                <span>@{user.userName}</span>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>{user.fullName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => {
            navigate("/nearby-people");
          }}
        >
          <MapPin size={16} strokeWidth={1.75} />
          Nearby People
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => {
            navigate("/settings");
          }}
        >
          <Settings size={16} strokeWidth={1.75} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => {
            dispatch(logOut());
            socket.disconnect();
          }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TopRightMenu;
