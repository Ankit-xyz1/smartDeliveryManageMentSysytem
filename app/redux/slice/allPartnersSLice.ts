import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
    value: any[];
}

const initialState: initialStateType = {
    value: []
};

export const partnersSlice = createSlice({
    name: "partners",
    initialState,
    reducers: {
        setPartner: (state, action: PayloadAction<any[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setPartner } = partnersSlice.actions;

export default partnersSlice.reducer;
