import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  devicePin: null | string;
  customerId: null | number;
  showIntroScreen: boolean;
  errorString: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  devicePin: null,
  customerId: null,
  showIntroScreen: true,
  errorString: '',
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
      state.showIntroScreen = false;
      state.errorString = '';
    },
    checkDeviceError: (state, { payload }) => {
      state.devicePin = payload?.detail || '';
      state.showIntroScreen = false;
      if (payload.status !== 401) {
        state.errorString = `${payload.status} - ${payload?.title}`;
      }
      state.isLoading = false;
    },
    clearAuthState: () => ({ ...initialState }),
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
  clearAuthState,
} = appSlice.actions;

export const { reducer, name } = appSlice;
