import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
    name: "socket",
    initialState: { connected: false },
    reducers: {
        setSocketStatus: (state, { payload }) => {
            state.connected = payload;
        }
    }
})

export const { setSocketStatus } = socketSlice.actions
export default socketSlice.reducer;