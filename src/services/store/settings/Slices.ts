import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  isProductionEnv: boolean;
}

const initialState: SettingsState = {
  isProductionEnv: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchEnv: state => {
      state.isProductionEnv = !state.isProductionEnv;
    },
  },
});

export const { switchEnv } = settingsSlice.actions;

export const { reducer, name } = settingsSlice;
