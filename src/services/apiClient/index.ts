import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from '@configs/apiConfig';

const axiosClient: AxiosInstance = axios.create({
  baseURL: ApiConfig.host,
  timeout: 20 * 1000,
});

axiosClient.interceptors.request.use(
  (axiosConfig: AxiosRequestConfig): AxiosRequestConfig => {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      accept: 'application/json',
      ['Content-Type']: 'application/json',
      ['X-Device-ID']: ApiConfig.deviceId,
    };
    console.log(
      `(REQUEST) ${axiosConfig.method} ${axiosConfig.url}`,
      axiosConfig.headers,
      axiosConfig.data,
    );
    return axiosConfig;
  },
);

axiosClient.interceptors.response.use(
  (
    response: AxiosResponse<any>,
  ): AxiosResponse<any> | Promise<AxiosResponse<any>> => {
    console.log(response);
    console.log(
      `(RESPONSE) ${response.config.method} ${response.config.url}`,
      response.headers,
      response.data,
    );
    return response;
  },
  error => {
    const { config: axiosConfig, response } = error;
    console.log(error);
    console.log(
      `(ERROR) ${axiosConfig.method} ${axiosConfig.url}`,
      response?.data,
    );
    return response;
  },
);

export const verifyDevice = () =>
  axiosClient.get(ApiConfig.routes.verifyDevice);

export const fetchVideoURL = (id: string) =>
  axiosClient.get(ApiConfig.routes.videoSource, {
    params: {
      id,
    },
    auth: ApiConfig.auth,
  });

export const pinUnlink = () => axiosClient.delete(ApiConfig.routes.pinUnlink);

export const getSubscribeInfo = () =>
  axiosClient.get(ApiConfig.routes.subscriptionInfo);
