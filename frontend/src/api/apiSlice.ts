import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { baseURL } from ".";
import { logOut, refreshAccessToken } from "../Components/AuthSteps/authSlice";
import { RootState } from "../store";
import { socket } from "../ws/socket";

export const baseQuery = fetchBaseQuery({
  baseUrl: baseURL + "/api/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReAuth = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result &&
    result.error &&
    "originalStatus" in result?.error &&
    result?.error?.originalStatus === 401
  ) {
    try {
      const refreshTokensResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
        },
        api,
        extraOptions
      );
      if (
        refreshTokensResult?.data &&
        (refreshTokensResult?.data as { accessToken: string }).accessToken
      ) {
        api.dispatch(
          refreshAccessToken(
            (refreshTokensResult.data as { accessToken: string }).accessToken
          )
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
        socket.disconnect();
      }
    } catch (error) {
      api.dispatch(logOut());
      socket.disconnect();
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    refreshAccessToken: builder.mutation<string, {}>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: (rawResults: {
        status: boolean;
        accessToken: string;
      }) => rawResults.accessToken,
    }),
    updatePushSubscription: builder.mutation<
      { status: boolean },
      {
        subscription: PushSubscription;
        userAgent: string;
      }
    >({
      query: ({ subscription, userAgent }) => ({
        url: "/update-push-subscription",
        method: "POST",
        body: {
          pushSubscription: JSON.stringify(subscription),
          userAgent,
        },
      }),
    }),
  }),
});

export const {
  useRefreshAccessTokenMutation,
  useUpdatePushSubscriptionMutation,
} = apiSlice;
