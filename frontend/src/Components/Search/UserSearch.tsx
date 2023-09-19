import { MouseEvent, useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdClose,
  MdMoreVert,
  MdOutlineLogout,
  MdOutlinePerson,
  MdOutlineSettings,
  MdSearch,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import { socket } from "../../ws/socket";
import { logOut } from "../AuthSteps/authSlice";
import Button from "../Button/Button";
import ContextMenu, { ContextMenuItem } from "../Menu/ContextMenu";
import { clearUserSearch, setUserSearchQuery } from "./searchSlice";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const searchQuery = useAppSelector((state) => state.search.userSearch.query);
  const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isShowContext = Boolean(menuElement);
  const handleMenuClick = (e: MouseEvent<HTMLButtonElement>) => {
    setMenuElement(e.currentTarget);
  };
  const handleClose = () => {
    setMenuElement(null);
  };
  useEffect(() => {
    if (searchInputRef.current && isSearch) {
      searchInputRef.current.focus();
    }
  }, [isSearch]);

  useEffect(() => {
    if (query && query.length === 10 && /^[0-9]+$/.test(query)) {
      dispatch(setUserSearchQuery(query));
    } else if (!query) {
      dispatch(clearUserSearch());
    }
  }, [query]);

  return (
    <div
      className="w-full sticky top-0 z-10 scroll-smooth shadow-sm bg-backdrop-25
     backdrop-blur-xl backdrop-saturate-150 "
    >
      <div className="w-full h-20 flex justify-between items-center px-4">
        <p
          className={`${
            isSearch ? "hidden" : "block"
          } text-gray-600 text-left text-xl font-medium mb-0 transition-all`}
        >
          texting
        </p>

        <div
          className={`${
            isSearch
              ? "w-full border-solid"
              : "w-20 d-flex items-center justify-between relative"
          } h-9 justify-self-end flex justify-start items-center`}
        >
          {!isSearch && (
            <>
              <Button
                variant="icon-only"
                className="flex justify-center items-center bg-transparent my-0 -mr-3"
                onClick={() => {
                  setIsSearch(!isSearch);
                }}
                icon={<MdSearch className="text-para-100 text-2xl" />}
              />
              <div className="relative">
                <Button
                  variant="icon-only"
                  className="flex justify-center items-center bg-transparent my-0"
                  onClick={handleMenuClick}
                  icon={<MdMoreVert className="text-para-100 text-2xl" />}
                  id="chat-main-context-menu"
                />
                <ContextMenu
                  id="chat-main-context-menu"
                  isShowContext={isShowContext}
                  onCloseContext={handleClose}
                  anchorElement={menuElement}
                >
                  <ContextMenuItem
                    displayTitle="Profile"
                    icon={
                      <MdOutlinePerson className="text-para-100 text-2xl" />
                    }
                    onClick={() => {
                      navigate("/profile");
                    }}
                  />
                  <ContextMenuItem
                    displayTitle="Settings"
                    icon={
                      <MdOutlineSettings className="text-para-100 text-2xl" />
                    }
                    onClick={() => {
                      navigate("/settings");
                    }}
                  />
                  <ContextMenuItem
                    icon={
                      <MdOutlineLogout className="text-para-100 text-2xl" />
                    }
                    onClick={() => {
                      dispatch(logOut());
                      socket.disconnect();
                    }}
                    displayTitle="Logout"
                  />
                </ContextMenu>
              </div>
            </>
          )}
          {isSearch && (
            <>
              <Button
                variant="icon-only"
                className="flex justify-center items-center bg-transparent my-0 -ml-3"
                onClick={() => {
                  setIsSearch(!isSearch);
                  if (searchQuery) dispatch(clearUserSearch());
                }}
                icon={<MdArrowBack className="text-para-100 text-2xl" />}
              />
              <input
                ref={searchInputRef}
                type="tel"
                maxLength={10}
                spellCheck={false}
                placeholder="search mobile number"
                value={query}
                pattern="/^[0-9]+$/"
                onChange={(e) => {
                  const { value } = e.target;

                  if (!value || /^[0-9]+$/.test(value)) {
                    setQuery(value);
                  }
                }}
                className="ml-2 bg-backdrop-0 border-0 outline-none text-gray-600 font-semibold tracking-wider flex-1 placeholder:text-gray-400"
              />
              {searchQuery && (
                <Button
                  variant="icon-only"
                  className="flex justify-center items-center bg-transparent my-0 justify-self-end -mr-3"
                  onClick={() => {
                    dispatch(setUserSearchQuery(""));
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  icon={<MdClose className="text-para-100 text-2xl" />}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
