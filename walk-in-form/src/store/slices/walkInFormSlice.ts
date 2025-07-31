
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalkInFormData } from '../../types/walkInForm';

interface WalkInFormState {
  currentStep: number;
  formData: WalkInFormData;
  isEditMode: boolean;
  isViewMode: boolean;
  editingRecordId?: string;
}

const initialState: WalkInFormState = {
  currentStep: 0,
  formData: {},
  isEditMode: false,
  isViewMode: false,
  editingRecordId: undefined,
};

const walkInFormSlice = createSlice({
  name: 'walkInForm',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateFormData: (state, action: PayloadAction<Partial<WalkInFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearForm: (state) => {
      state.formData = {};
      state.currentStep = 0;
      state.isEditMode = false;
      state.isViewMode = false;
      state.editingRecordId = undefined;
    },
    setEditMode: (state, action: PayloadAction<{ isEdit: boolean; recordId?: string; formData?: WalkInFormData }>) => {
      state.isEditMode = action.payload.isEdit;
      state.isViewMode = false;
      state.editingRecordId = action.payload.recordId;
      if (action.payload.formData) {
        state.formData = action.payload.formData;
      }
      state.currentStep = 0;
    },
    setViewMode: (state, action: PayloadAction<{ recordId?: string; formData?: WalkInFormData }>) => {
      state.isEditMode = false;
      state.isViewMode = true;
      state.editingRecordId = action.payload.recordId;
      if (action.payload.formData) {
        state.formData = action.payload.formData;
      }
      state.currentStep = 0;
    },
  },
});

export const { setCurrentStep, updateFormData, clearForm, setEditMode, setViewMode } = walkInFormSlice.actions;

export default walkInFormSlice.reducer;
