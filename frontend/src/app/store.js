import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';

import userInfoReducer from '../slices/userInfoSlice';

import orderReducer from '../slices/orderSlice';

import { apiSlice } from '../slices/apiSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    userInfo: userInfoReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
