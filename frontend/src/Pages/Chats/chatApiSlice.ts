import { apiSlice } from "../../api/apiSlice";
import { socket } from "../../ws/socket";
import { MessageInterface } from "./ChatBox";
import { inboxInterface } from "./chatSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInboxList: build.query<inboxInterface[], {}>({
      query: () => "chats",
      transformResponse: (rawResult: {
        status: boolean;
        result: inboxInterface[];
      }) => rawResult.result,
      keepUnusedDataFor: 60,
      // onCacheEntryAdded: async (
      //   arg,
      //   {
      //     updateCachedData,
      //     cacheDataLoaded,
      //     dispatch,
      //     getState,
      //     cacheEntryRemoved,
      //   }
      // ) => {
      //   try {
      //     await cacheDataLoaded;
      //     const addGroupListner = (inbox: inboxInterface) => {
      //       updateCachedData((data) => {
      //         data.push(inbox);
      //       });
      //     };
      //     socket.on("group:added", addGroupListner);
      //   } catch (error) {
      //     console.log("error in listner", error);
      //   }

      //   await cacheEntryRemoved;
      //   socket.off("group:added");
      // },
    }),
    getInbox: build.query<
      inboxInterface,
      { group?: string; participant?: string }
    >({
      query: ({ group, participant }) => ({
        url: "chats",
        params: { group, participant },
      }),
      transformResponse: (rawResult: {
        status: boolean;
        result: inboxInterface;
      }) => rawResult.result,
    }),
    getMessagesByGroup: build.query<
      { messages: MessageInterface[]; offset: number; max: boolean },
      { groupId: string; currentPage: number }
    >({
      query: (params) => ({ url: "messages", params }),
      transformResponse: (rawResult: {
        status: boolean;
        data: { messages: MessageInterface[]; offset: number; max: boolean };
      }) => rawResult.data,
    }),
    getOnlineStatus: build.query<
      { online_status: boolean },
      { userId: string }
    >({
      query: (params) => ({ url: "get_online_status", params }),
      transformResponse: (rawResult: {
        status: boolean;
        data: { online_status: boolean };
      }) => rawResult.data,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetInboxListQuery,
  useGetMessagesByGroupQuery,
  useLazyGetMessagesByGroupQuery,
  useLazyGetInboxListQuery,
  useGetOnlineStatusQuery,
} = chatApiSlice;
