import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import GroupSkeleton from "../Group/GroupSkeleton";
import noResultsFoundImage from "../../assets/images/no_results.svg";
import { useLazySearchUserQuery } from "./searchApiSlice";
import { useGetInboxListQuery } from "../../Pages/Chats/chatApiSlice";
import { useEffect, useState } from "react";
import { inboxInterface, setCurrentInbox } from "../../Pages/Chats/chatSlice";
import Group from "../Group/Group";

const UserSearchResults = () => {
  const searchQuery = useAppSelector((state) => state.search.userSearch.query);
  const dispatch = useAppDispatch();
  const [searchResultData, setSearchResultData] =
    useState<inboxInterface | null>(null);
  const [fetchUser, { data, isLoading, isSuccess, isError, error }] =
    useLazySearchUserQuery();
  const userMobileNumber = useAppSelector(
    (state) => state.auth.user?.mobileNumber
  );
  const { data: inboxList } = useGetInboxListQuery({});
  useEffect(() => {
    if (searchQuery) {
      const r =
        (inboxList &&
          inboxList?.length > 0 &&
          inboxList?.find(
            (item) => item.participant?.mobileNumber === searchQuery
          )) ||
        null;

      if (r) {
        setSearchResultData(r);
      } else {
        fetchUser(searchQuery);
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    if (data && data.mobileNumber) {
      setSearchResultData({
        participant: data,
        group: "",
        inboxId: "",
        lastMessage: null,
        updatedAt: "",
      });
    }
  }, [data]);
  return (
    <div className="w-full">
      {isLoading && <GroupSkeleton isSearchItem />}
      {searchResultData && (
        <Group
          {...searchResultData}
          onClick={() => {
            if (
              userMobileNumber !== searchResultData.participant?.mobileNumber
            ) {
              dispatch(
                setCurrentInbox({
                  groupId: searchResultData.group,
                  inboxId: searchResultData.inboxId,
                  participant: searchResultData.participant,
                  unreadMessageCount: searchResultData.unreadMessageCount || 0,
                })
              );
            }
          }}
        />
      )}
      {isError && error && (
        <div className="w-44 mx-auto mt-36">
          <img
            src={noResultsFoundImage}
            alt={"error image"}
            className="w-2/3 mx-auto"
          />
          <p className="text-center mt-4 text-backdrop-575 lowercase">
            {
              (error as { data: { status: boolean; message: string } }).data
                .message
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearchResults;
