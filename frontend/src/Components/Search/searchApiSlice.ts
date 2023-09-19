import { apiSlice } from "../../api/apiSlice";
import { userSearchResultInterface } from "./searchSlice";

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    searchUser: build.query<userSearchResultInterface | null, string>({
      query: (q) => ({ params: { q }, url: "search-user" }),
      transformResponse: (rawResult: {
        status: boolean;
        result: userSearchResultInterface | null;
      }) => rawResult.result || null,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useSearchUserQuery, useLazySearchUserQuery } = searchApiSlice;
