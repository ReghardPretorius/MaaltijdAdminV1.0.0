import { apiSlice } from './apiSlice';
const EMAIL_URL = '/email';

export const otpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOTP: builder.mutation({
      query: (data) => ({
        url: `${EMAIL_URL}/sendOTP`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${EMAIL_URL}/verifyOTP`,
        method: 'POST',
        body: data,
      }),
    }),
    sendFPOTP: builder.mutation({
      query: (data) => ({
        url: '/change/email/sendFPOTP',
        method: 'POST',
        body: data,
      }),
    }),
    verifyFPOTP: builder.mutation({
      query: (data) => ({
        url: '/change/email/verifyFPOTP',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useSendFPOTPMutation,
  useVerifyFPOTPMutation,

} = otpApiSlice;