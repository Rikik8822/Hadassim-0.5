import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../featuers/user/userSlice"
import orderSlice from "../featuers/order/orderSlice"

/**
 * Configures the Redux store with slices for user and order management.
 * This store combines the reducers from the user and order slices, allowing
 * for state management related to users and orders throughout the app.
 */

export const store = configureStore({
    reducer: {
        user: userSlice,
        order: orderSlice
    }
})