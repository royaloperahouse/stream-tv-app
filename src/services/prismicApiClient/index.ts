import Prismic from '@prismicio/client';
import {
  prismicApiEndpoint,
  prismicApiAccessToken as accessToken,
  documentTypes,
  getRefLabelOfPublishing,
} from '@configs/prismicApiConfig';
import DefaultClient from '@prismicio/client/types/client';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { QueryOptions } from '@prismicio/client/types/ResolvedApi';

type TQueryObj = {
  queryPredicates?: Array<string>;
  queryOptions?: QueryOptions;
};
type TCommonQueryOptions = Partial<{ ref: string }>;

const prismicApiClient: DefaultClient.DefaultClient = Prismic.client(
  prismicApiEndpoint,
  { accessToken },
);

const getCommonQueryOptions = async (
  prismicClient: DefaultClient.DefaultClient,
): Promise<TCommonQueryOptions> => {
  const commonQueryOptions: TCommonQueryOptions = {};
  try {
    const resolvedApi = await prismicClient.api.get();
    const foundRef = resolvedApi.refs.find(
      r => r.label === getRefLabelOfPublishing(),
    );
    if (foundRef?.ref) {
      commonQueryOptions.ref = foundRef?.ref;
    }
  } finally {
    return commonQueryOptions;
  }
};

const commonQuery = async function (
  queryObj: TQueryObj = {},
): Promise<ApiSearchResponse> {
  let commonQueryOptions: TCommonQueryOptions = await getCommonQueryOptions(
    prismicApiClient,
  );
  const { queryPredicates = '', queryOptions = {} } = queryObj;

  return prismicApiClient.query(queryPredicates, {
    ...commonQueryOptions,
    ...queryOptions,
  });
};

export const getDigitalEventDetails = (
  queryObj: TQueryObj = {},
): Promise<ApiSearchResponse> =>
  commonQuery({
    queryPredicates: [
      Prismic.Predicates.at('document.type', documentTypes.digitalEventDetails),
      ...[
        ...(Array.isArray(queryObj.queryPredicates)
          ? queryObj.queryPredicates
          : []),
      ],
    ],
    queryOptions: queryObj.queryOptions,
  });

export const getVideoDetails = (
  queryObj: TQueryObj = {},
): Promise<ApiSearchResponse> =>
  commonQuery({
    queryPredicates: [
      Prismic.Predicates.at('document.type', documentTypes.digitalEventVideo),
      ...[
        ...(Array.isArray(queryObj.queryPredicates)
          ? queryObj.queryPredicates
          : []),
      ],
    ],
    queryOptions: queryObj.queryOptions,
  });

export default prismicApiClient;
