import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoaded: boolean;
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
  isLoaded: false,
  devicePin: null,
  customerId: null,
  showIntroScreen: true,
  errorString: '',
  fullSubscription: false,
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
      state.isLoaded = true;
    },
    checkDeviceError: (state, { payload }) => {
      state.devicePin = payload?.detail || '';
      if (payload.status !== 401) {
        state.errorString = `${payload.status} - ${payload?.title}`;
      }
      state.isLoading = false;
      state.isLoaded = true;
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
