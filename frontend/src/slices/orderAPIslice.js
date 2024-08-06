import { apiSlice } from './apiSlice';
const ORDERS_URL = '/order';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/updateOrder`,
        method: 'PUT',
        body: data,
      }),
    }),

    updatePaidOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/updatepaidorder`,
        method: 'PUT',
        body: data,
      }),
    }),
    

      getUserOrders: builder.mutation({
        query: (data) => ({
          url: `${ORDERS_URL}/userOrders`,
          method: 'POST',
          body: data,
        }),
    }),
    getOrderItems: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/orderItems`,
        method: 'POST',
        body: data,
      }),
  }),

  updateStatusLog: builder.mutation({
    query: (data) => ({
      url: `${ORDERS_URL}/updateStatus`,
      method: 'POST',
      body: data,
    }),
  }),

  getOrderDetails: builder.mutation({
    query: (data) => ({
      url: `${ORDERS_URL}/orderdetails`,
      method: 'POST',
      body: data,
    }),
}),

getOrderDetailsNoUser: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/orderdetailsnouser`,
    method: 'POST',
    body: data,
  }),
}),



getPaidOrderDetails: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/paidorderdetails`,
    method: 'POST',
    body: data,
  }),
}),

sendOrderEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/sendOrder`,
    method: 'POST',
    body: data,
  }),
}),

sendOutForDeliveryEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/outfordelivery`,
    method: 'POST',
    body: data,
  }),
}),

sendDeliveredEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/delivered`,
    method: 'POST',
    body: data,
  }),
}),

sendGatheringIngredientsEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/gathering`,
    method: 'POST',
    body: data,
  }),
}),

sendCookingEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/cooking`,
    method: 'POST',
    body: data,
  }),
}),

sendRefrigeratingEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/refrigerating`,
    method: 'POST',
    body: data,
  }),
}),

sendReschedule1Email: builder.mutation({
  query: (data) => ({
    url: `/email/order/reschedule1`,
    method: 'POST',
    body: data,
  }),
}),

sendAdminOrderEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/sendAdminOrder`,
    method: 'POST',
    body: data,
  }),
}),

sendRescheduleEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/sendRescheduleOrder`,
    method: 'POST',
    body: data,
  }),
}),

getNumberOfDeliveriesForToday: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/getNumberOfDeliveries`,
    method: 'POST',
    body: data,
  }),
}),

getDeliveriesForToday: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/getdeliveriesfortoday`,
    method: 'POST',
    body: data,
  }),
}),

GetUndeliveredOrders: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/getundeliveredorders`,
    method: 'POST',
    body: data,
  }),
}),



  }),
});

export const {
    useUpdateOrderMutation,
    useGetUserOrdersMutation,
    useGetOrderItemsMutation,
    useGetOrderDetailsMutation,
    useUpdateStatusLogMutation,
    useSendOrderEmailMutation,
    useGetPaidOrderDetailsMutation,
    useSendAdminOrderEmailMutation,
    useGetNumberOfDeliveriesForTodayMutation,
    useGetDeliveriesForTodayMutation,
    useSendDeliveredEmailMutation,
    useSendOutForDeliveryEmailMutation,
    useSendGatheringIngredientsEmailMutation,
    useSendCookingEmailMutation,
    useSendRefrigeratingEmailMutation,
    useUpdatePaidOrderMutation,
    useSendReschedule1EmailMutation,
    useGetUndeliveredOrdersMutation,
    useGetOrderDetailsNoUserMutation,
    useSendRescheduleEmailMutation

} = orderApiSlice;