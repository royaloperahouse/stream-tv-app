import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  devicePin: null | string;
  customerId: null | number;
  showIntroScreen: boolean;
  errorString: string;
  fullSubscription: boolean;
  userEmail: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  devicePin: null,
  customerId: null,
  showIntroScreen: true,
  errorString: '',
  fullSubscription: true,
  userEmail: '',
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
      state.userEmail = payload.data.attributes.email;
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
    toggleSubscriptionMode: state => {
      state.fullSubscription = !state.fullSubscription;
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
  clearAuthState,
  toggleSubscriptionMode,
} = appSlice.actions;

export const { reducer, name } = appSlice;
