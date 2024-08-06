import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderId: '',
  deliveryDay: '',
  
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    resetOrderId: (state) => {
      state.orderId = '';
    },
    updateDeliveryDay: (state, action) => {
      state.deliveryDay = action.payload;
    },
  }
});

export const { updateOrderId, resetOrderId, updateDeliveryDay } = orderSlice.actions;
export default orderSlice.reducer;