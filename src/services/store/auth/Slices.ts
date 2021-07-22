import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  devicePin: null | string;
  customerId: null | number;
  showIntroScreen: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  devicePin: null,
  customerId: null,
  showIntroScreen: true,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoginLoop: state => state,
    endLoginLoop: state => state,
    switchOnIntroScreen: state => {
      state.showIntroScreen = true;
    },
    switchOffIntroScreen: state => {
      state.showIntroScreen = false;
    },
    checkDeviceStart: state => {
      state.isLoading = true;
    },
    checkDeviceSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.customerId = payload.data.attributes.customerId;
      state.devicePin = payload.data.attributes.deviceId;
      state.isLoading = false;
    },
    checkDeviceError: (state, { payload }) => {
      if (payload?.detail) {
        state.devicePin = payload?.detail;
      }
      state.isLoading = false;
    },
  },
});

export const {
  checkDeviceStart,
  checkDeviceSuccess,
  checkDeviceError,
  switchOnIntroScreen,
  switchOffIntroScreen,
  startLoginLoop,
  endLoginLoop,
} = appSlice.actions;

export const { reducer, name } = appSlice;
