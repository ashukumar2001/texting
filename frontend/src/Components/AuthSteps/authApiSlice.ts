import { apiSlice } from "../../api/apiSlice";
import { User } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    authenticate: build.mutation({
      query: (creds: { token: string }) => ({
        url: "authenticate",
        method: "POST",
        body: { ...creds },
      }),
    }),
    updateUserName: build.mutation<any, string>({
      query: (userName) => ({
        url: "update-username",
        method: "POST",
        body: { userName },
      })
    }),
    userNameAvailability: build.query<any, string>({
      query: (userName) => ({ params: { userName }, url: "username-availability" }),
    }),
    activateAccount: build.mutation<User, { fullName: string }>({
      query: (data) => ({
        url: "activate",
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (rawResult: {
        status: boolean;
        message: string;
        user: User;
      }) => rawResult.user,
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useActivateAccountMutation,
  useUpdateUserNameMutation,
  useUserNameAvailabilityQuery,
} = authApiSlice;
