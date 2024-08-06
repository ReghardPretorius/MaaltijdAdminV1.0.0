import { apiSlice } from './apiSlice';
const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/userinfo`,
        method: 'POST',
        body: data,
      }),
    }),

    getAllUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/allusers`,
        method: 'POST',
        body: data,
      }),
    }),

    updateWallet: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatewallet`,
        method: 'POST',
        body: data,
      }),
    }),

    createWalletLog: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createwalletlog`,
        method: 'POST',
        body: data,
      }),
    }),

    

  }),
});

export const {
  useGetUserInfoMutation, useGetAllUsersMutation,   useCreateWalletLogMutation, useUpdateWalletMutation
} = userApiSlice;