import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../Components/Animated/AnimatedPage";
import Button from "../../Components/Button/Button";
import ChatBoxInput from "../../Components/Input/ChatBoxInput";
import { clearUserSearch } from "../../Components/Search/searchSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import useScrollableHeight from "../../Hooks/useScrollHeight";
import { getAvatarUrlFromSeed } from "../../utils/helpers";
import { socket } from "../../ws/socket";
import {
  chatApiSlice,
  useGetMessagesByGroupQuery,
  useGetOnlineStatusQuery,
} from "./chatApiSlice";
import {
  clearCurrentInbox,
  setCurrentInbox,
  setCurrentPage,
} from "./chatSlice";
import ChatMessage from "./ChatMessage";
export interface MessageInterface {
  content: {
    messageText: string;
    timestamp: number;
  };
  from: string;
  status: number;
}
const ChatBox = () => {
  const [hasMore, setHasMore] = useState({ top: false, bottom: false });
  const currentPage = useAppSelector(
    (state) => state.chat.currentInobx.currentPage
  );
  const currentInboxData = useAppSelector((state) => state.chat.currentInobx);
  const [getInbox] = chatApiSlice.endpoints.getInbox.useLazyQuerySubscription();
  const userId = useAppSelector((state) => state.auth.user._id);
  const checkInputRef: RefObject<HTMLElement | undefined> = useRef(null);
  const { data: lastResult } = useGetMessagesByGroupQuery({
    groupId: currentInboxData.groupId as string,
    currentPage: currentPage + 1,
  });
  const { data: currentResult } = useGetMessagesByGroupQuery({
    groupId: currentInboxData.groupId as string,
    currentPage: currentPage,
  });
  const { data: onlineStatusResult } = useGetOnlineStatusQuery(
    {
      userId: currentInboxData.participant?._id || "",
    },
    { pollingInterval: 30000 }
  );
  const chatMessagesContainerRef: RefObject<HTMLElement | undefined> =
    useRef(null);
  const [message, setMessage] = useState<string>("");
  const [isShowEmojiInput, setIsShowEmojiInput] = useState<boolean>(false);
  const searchQuery = useAppSelector((state) => state.search.userSearch.query);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const combineMessages: MessageInterface[] = useMemo(() => {
    const arr = new Array(10 * (currentPage + 1));
    for (const data of [lastResult, currentResult]) {
      if (data) {
        arr.splice(data.offset, data.messages.length, ...(data.messages || []));
      }
    }
    setHasMore({
      top: lastResult?.messages.length === 10 && !lastResult.max,
      bottom: currentResult?.messages.length === 10 && currentPage > 0,
    });
    return arr.reverse();
  }, [currentPage, lastResult, currentResult]);

  const [chatMessagesScrollHeight, chatBoxHeight] = useScrollableHeight(
    checkInputRef,
    24,
    [combineMessages, message, isShowEmojiInput]
  );
  useEffect(() => {
    return () => {
      dispatch(clearCurrentInbox());
    };
  }, []);

  useEffect(() => {
    if (
      combineMessages &&
      combineMessages.length > 0 &&
      chatMessagesContainerRef.current?.scrollHeight &&
      currentPage === 0 &&
      !hasMore.bottom
    ) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [currentInboxData, currentPage, combineMessages, hasMore]);

  useEffect(() => {
    if (
      currentInboxData &&
      currentInboxData.groupId &&
      currentInboxData?.unreadMessageCount
    ) {
      // clear the unread message count from redis cache with given group and user
      socket.emit("group:seen_unread_message", {
        groupId: currentInboxData.groupId,
      });
      // update the local cache for inbox with unread count
      dispatch(
        chatApiSlice.util.updateQueryData("getInboxList", {}, (inboxList) => {
          inboxList.map((inbox) => {
            if (
              inbox.group === currentInboxData?.groupId &&
              inbox.unreadMessageCount
            ) {
              inbox.unreadMessageCount = 0;
            }
          });
        })
      );
    }

    return () => {
      socket.off("group:seen_unread_message");
    };
  }, [currentInboxData]);

  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      const target = chatMessagesContainerRef.current;
      // check if scroll direction is upwards
      if (target.scrollTop === 0) {
        if (target.scrollHeight - target.clientHeight < 200) {
          target.scrollTop = target.scrollHeight - target.clientHeight - 20;
        } else {
          target.scrollTop = 200;
        }
        // check if scroll direction is downwards
      } else if (
        Math.floor(
          target.scrollHeight - (target.clientHeight + target.scrollTop)
        ) < 2 &&
        currentPage > 0
      ) {
        target.scrollTop = target.scrollTop - 200;
      }
    }
  }, [combineMessages]);

  // fetch inboxId and groupId if exists
  useEffect(() => {
    if (!currentInboxData.groupId && !currentInboxData.inboxId) {
      getInbox({ participant: currentInboxData.participant?._id }, true).then(
        ({ isSuccess, data }) => {
          if (isSuccess && data?.inboxId && data?.group) {
            dispatch(
              setCurrentInbox({
                groupId: data.group,
                inboxId: data.inboxId,
                participant: data.participant,
                unreadMessageCount: data.unreadMessageCount || 0,
              })
            );
          }
        }
      );
    }
  }, [currentInboxData]);

  return (
    <AnimatedPage>
      <div className="w-full sticky top-0 z-10 scroll-smoot bg-backdrop-25 backdrop-blur-xl backdrop-saturate-150 shadow-sm">
        <div className="w-full h-20 flex justify-start items-center px-4">
          <Button
            variant="icon-only"
            onClick={() => {
              navigate(-1);
              if (searchQuery) {
                dispatch(clearUserSearch());
              }
            }}
            icon={<MdArrowBack className="text-gray-600 text-2xl" />}
            className="flex justify-center items-center bg-transparent -ml-3 mr-2"
          />

          <div className="h-12 w-12 flex justify-center items-center rounded-full border relative">
            <img
              src={currentInboxData?.participant?.profilePicture}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAvatarUrlFromSeed(
                  currentInboxData?.participant?.fullName
                );
              }}
              alt={currentInboxData?.participant?.fullName}
              className="w-full h-full rounded-full"
            />
            {onlineStatusResult?.online_status && (
              <div
                title="online"
                className="h-3 w-3 rounded-full bg-[#00a67e] absolute -right-1 -bottom-2 -translate-y-1/2 -translate-x-1/2"
              ></div>
            )}
          </div>
          <p className="text-gray-600 text-base font-bold tracking-wider ml-4">
            {currentInboxData?.participant?.fullName}
          </p>
        </div>
      </div>
      <div
        style={{
          height: chatMessagesScrollHeight,
          paddingBottom: chatBoxHeight + "px",
        }}
        onScrollCapture={(e) => {
          const target = e.currentTarget;
          const scrolledHeight = target.scrollTop + target.clientHeight;
          const totalHeight = target.scrollHeight;
          if (target.scrollTop === 0 && hasMore.top) {
            dispatch(setCurrentPage(currentPage + 1));
          } else if (totalHeight - scrolledHeight < 2 && hasMore.bottom) {
            dispatch(setCurrentPage(currentPage - 1));
          }
        }}
        ref={chatMessagesContainerRef as RefObject<HTMLDivElement>}
        className="grow flex flex-col overflow-auto bg-slate-50 h-full"
      >
        {combineMessages &&
          combineMessages.map((msg, index) => {
            return (
              <ChatMessage
                key={`chat-message-${index}`}
                message={msg}
                nextMessage={combineMessages[index + 1]}
                index={index}
                userId={userId}
              />
            );
          })}
      </div>

      <div
        ref={checkInputRef as RefObject<HTMLDivElement>}
        className="w-full sticky bottom-0 z-10 flex bg-slate-50 justify-center items-center py-2 overflow-hidden"
      >
        <ChatBoxInput
          message={message}
          setMessage={setMessage}
          isShowEmojiInput={isShowEmojiInput}
          setIsShowEmojiInput={setIsShowEmojiInput}
        />
      </div>
    </AnimatedPage>
  );
};

export default ChatBox;
