import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from '@configs/apiConfig';
import { store } from '@services/store';
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
    if (axiosConfig.url?.includes(ApiConfig.routes.checkoutPurchasedStreams)) {
      axiosConfig.headers['x-customer-id'] = store.getState().auth.customerId;
    }
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
    if (response === undefined) {
      return { status: 500 };
    }
    return response;
  },
);

export const verifyDevice = () =>
  axiosClient.get(ApiConfig.routes.verifyDevice, {
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const fetchVideoURL = (id: string) =>
  axiosClient.get(ApiConfig.routes.videoSource, {
    params: {
      id,
    },
    auth: ApiConfig.auth,
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const pinUnlink = () =>
  axiosClient.delete(ApiConfig.routes.pinUnlink, {
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const getSubscribeInfo = () =>
  axiosClient.get(ApiConfig.routes.subscriptionInfo, {
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const getPurchasedStreams = () =>
  axiosClient.get(ApiConfig.routes.checkoutPurchasedStreams, {
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const getAllEvalibleEventsForPPV = () =>
  axiosClient.get(ApiConfig.routes.checkoutPayPerView, {
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const getEventsByFeeIds = (feeIds: string) =>
  axiosClient.get(ApiConfig.routes.digitalEvents, {
    params: { feeIds },
    auth: ApiConfig.auth,
    baseURL: store.getState().settings.isProductionEnv
      ? ApiConfig.host
      : ApiConfig.stagingEnv,
  });

export const getAccessToWatchVideo = async (
  getVideoDetails: Promise<any>,
): Promise<{ [key: string]: any } | null> => {
  try {
    const digitalEventVideoResponse = await getVideoDetails;
    const videoFromPrismic = digitalEventVideoResponse.results.find(
      (prismicResponseResult: any) =>
        prismicResponseResult.data?.video?.video_type === 'performance',
    );

    if (videoFromPrismic === undefined || !videoFromPrismic.id) {
      throw new Error();
    }
    const subscriptionResponse = await getSubscribeInfo();
    if (
      subscriptionResponse.status >= 200 &&
      subscriptionResponse.status < 400 &&
      subscriptionResponse?.data?.data?.attributes?.isSubscriptionActive
    ) {
      return videoFromPrismic;
    }
    const purchasedStreamsResponse = await getPurchasedStreams();
    if (
      purchasedStreamsResponse.status >= 200 &&
      purchasedStreamsResponse.status < 400 &&
      Array.isArray(
        purchasedStreamsResponse?.data?.data?.attributes?.streams,
      ) &&
      purchasedStreamsResponse.data.data.attributes.streams.length
    ) {
      const ids: Array<string> =
        purchasedStreamsResponse.data.data.attributes.streams.map(
          (stream: {
            stream_id: string;
            stream_desc: string;
            purchase_dt: string;
          }) => stream.stream_id,
        );
      if (!ids.length) {
        return null;
      }
      const eventsForPPVPromiseSettledResponse: Array<
        PromiseSettledResult<AxiosResponse<any>>
      > = await eventsOnFeePromiseFill(ids);
      const eventsForPPVData = eventsForPPVPromiseSettledResponse.reduce<{
        data: Array<any>;
        included: Array<any>;
      }>(
        (acc, item) => {
          if (item.status === 'fulfilled') {
            acc.data = acc.data.concat(
              Array.isArray(item.value.data?.data) ? item.value.data.data : [],
            );
            acc.included = acc.included.concat(
              Array.isArray(item.value.data?.included)
                ? item.value.data.included
                : [],
            );
          }
          return acc;
        },
        { data: [], included: [] },
      );
      if (
        eventsForPPVData.included.some(
          (item: any) =>
            item.type === 'videoInfo' && item.id === videoFromPrismic.id,
        )
      ) {
        return videoFromPrismic;
      }
    }
    return null;
  } catch (err: any) {
    throw new Error('Something went wrong');
  }
};

export function eventsOnFeePromiseFill(
  ids: Array<string>,
  maxCountIdsForResponse: number = 50,
): Promise<PromiseSettledResult<AxiosResponse<any>>[]> {
  const maxChunksIndex = Math.ceil(ids.length / maxCountIdsForResponse) - 1;
  const allPromises: Array<Promise<AxiosResponse<any>>> = [];
  for (let i = 0; i <= maxChunksIndex; i++) {
    allPromises.push(
      getEventsByFeeIds(
        ids
          .slice(i * maxCountIdsForResponse, (i + 1) * maxCountIdsForResponse)
          .join(','),
      ),
    );
  }
  return Promise.allSettled(allPromises);
}
