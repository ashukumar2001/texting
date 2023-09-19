import AnimatedPage from "../../Components/Animated/AnimatedPage";
import UserSearch from "../../Components/Search/UserSearch";
import UserSearchResults from "../../Components/Search/UserSearchResults";
import { useAppSelector } from "../../Hooks/redux";
import ChatsTab from "./ChatsTab";

const Chats = () => {
  const searchQuery = useAppSelector((state) => state.search.userSearch.query);

  return (
    <AnimatedPage>
      <div className="relative h-screen overflow-y-auto scroll-smooth">
        <UserSearch />
        {!searchQuery && <ChatsTab />}
        {searchQuery && <UserSearchResults />}
      </div>
    </AnimatedPage>
  );
};

export default Chats;
