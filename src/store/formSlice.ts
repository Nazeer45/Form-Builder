import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FormField } from "../types";

type FormSchema = {
  name: string;
  createdAt: string;
  fields: FormField[];
};

interface FormState {
  currentForm: FormSchema | null;
}

const initialState: FormState = {
  currentForm: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = action.payload;
    },
    updateFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload;
      }
    },
    updateFormName: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
      }
    },
    clearForm: (state) => {
      state.currentForm = null;
    },
  },
});

export const { setForm, updateFields, updateFormName, clearForm } = formSlice.actions;
export default formSlice.reducer;
