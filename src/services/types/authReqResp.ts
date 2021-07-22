export type TAuthResponseFailure = {
  errors: Array<TAuthResponseError>;
};
export type TAuthResponseSuccess = {
  data: {
    id: string;
    type: string;
    attributes: {
      deviceId: string;
      customerId: number;
    };
    relationships: { [key: string]: any };
  };
};
export type TAuthResponseError = {
  status: number;
  title: string;
  detail: string;
};
