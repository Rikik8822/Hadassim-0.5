import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
    name: "user",
    initialState: { currentUser: null },
    reducers: {
        userIn: (state, action) => {
            state.currentUser = action.payload;
            axios.defaults.headers.common["authorization"] = action.payload.token;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
        },
        userOut: (state, action) => {
            state.currentUser = null;
            delete axios.defaults.headers.common["authorization"];
            localStorage.removeItem("currentUser");
        }
    }
})
export const { userIn, userOut } = userSlice.actions;
export default userSlice.reducer;