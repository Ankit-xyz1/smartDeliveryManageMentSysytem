import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
    value: any[];
}

const initialState: initialStateType = {
    value: []
};

export const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<any[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
