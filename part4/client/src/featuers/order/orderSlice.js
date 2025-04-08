import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: { orders: [] },
  reducers: {
    fetchOrders: (state, action) => {
      state.orders = action.payload;
    },
  }
})
export const { fetchOrders } = orderSlice.actions;
export default orderSlice.reducer;