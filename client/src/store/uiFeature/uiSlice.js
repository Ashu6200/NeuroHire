import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    upgradeModal: {
      open: false,
      message: '',
      feature: '',
    },
  },
  reducers: {
    triggerUpgradeModal: (state, action) => {
      state.upgradeModal.open = true;
      state.upgradeModal.message = action.payload?.message || 'Upgrade your plan to continue.';
      state.upgradeModal.feature = action.payload?.feature || '';
    },
    closeUpgradeModal: (state) => {
      state.upgradeModal.open = false;
      state.upgradeModal.message = '';
      state.upgradeModal.feature = '';
    },
  },
});

export const { triggerUpgradeModal, closeUpgradeModal } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
