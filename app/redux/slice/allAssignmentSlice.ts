import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
    value: any[];
}

const initialState: initialStateType = {
    value: []
};

export const assigmentSlice = createSlice({
    name: "assigments",
    initialState,
    reducers: {
        setassigment: (state, action: PayloadAction<any[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setassigment } = assigmentSlice.actions;

export default assigmentSlice.reducer;
