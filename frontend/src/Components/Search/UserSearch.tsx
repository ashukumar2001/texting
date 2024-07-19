import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import { clearUserSearch, setUserSearchQuery } from "./searchSlice";
import { userNameValidationRegEx } from "../../utils/constants";
import TopRightMenu from "@/Components/Search/TopRightMenu";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Search, X } from "lucide-react";

const UserSearch = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const searchQuery = useAppSelector((state) => state.search.userSearch.query);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (searchInputRef.current && isSearch) {
      searchInputRef.current.focus();
    }
  }, [isSearch]);

  useEffect(() => {
    if (query && userNameValidationRegEx.test(query)) {
      dispatch(setUserSearchQuery(query));
    } else if (!query) {
      dispatch(clearUserSearch());
    }
  }, [query]);

  return (
    <div
      className="w-full sticky top-0 z-10 scroll-smooth shadow-sm bg-backdrop-25
     backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="w-full h-20 flex justify-between items-center px-4">
        <p
          className={`${
            isSearch ? "hidden" : "block"
          } text-left text-xl font-medium mb-0 transition-all`}
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
                variant="ghost"
                size="icon"
                onClick={() => setIsSearch((prev) => !prev)}
              >
                <Search size={20} strokeWidth={1.75} />
              </Button>
              <TopRightMenu />
            </>
          )}
          {isSearch && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearch(false);
                  if (searchQuery) dispatch(clearUserSearch());
                }}
              >
                <ArrowLeft size={20} strokeWidth={1.75} />
              </Button>
              <input
                ref={searchInputRef}
                type="text"
                spellCheck={false}
                placeholder="search username..."
                value={query}
                onChange={(e) => {
                  const { value } = e.target;

                  if (!value || userNameValidationRegEx.test(value)) {
                    setQuery(value);
                  }
                }}
                className="ml-2 bg-backdrop-0 border-0 outline-none text-gray-600 font-semibold tracking-wider flex-1 placeholder:text-gray-400"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  dispatch(setUserSearchQuery(""));
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <X size={16} strokeWidth={1.75} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
