import Prismic from '@prismicio/client';
import {
  prismicApiEndpoint,
  prismicApiAccessToken as accessToken,
  documentTypes,
  refLabelOfPublishing,
} from '@configs/prismicApiConfig';
import DefaultClient from '@prismicio/client/types/client';
//import Predicates from '@prismicio/client/types/Predicates';
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
      r => r.label === refLabelOfPublishing,
    );
    if (foundRef?.ref) {
      commonQueryOptions.ref = foundRef?.ref;
    }
  } finally {
    return commonQueryOptions;
  }
};

const commonQuery = (function () {
  let commonQueryOptions: TCommonQueryOptions = {};
  let commonQueryOptionsLoaded: boolean = false;
  return async function (queryObj: TQueryObj = {}): Promise<ApiSearchResponse> {
    const { queryPredicates = '', queryOptions = {} } = queryObj;
    if (!commonQueryOptionsLoaded) {
      commonQueryOptions = {
        ...(await getCommonQueryOptions(prismicApiClient)),
      };
      commonQueryOptionsLoaded = true;
    }
    return prismicApiClient.query(queryPredicates, {
      ...commonQueryOptions,
      ...queryOptions,
    });
  };
})();

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

export default prismicApiClient;

//
/*
export const simpleClientExample = () =>
  prismicApiClient.query(
    Prismic.Predicates.at('document.type', documentTypes.digitalEventDetails),
    { ref: 'YO71ORAAABAAhkmF~YO71_BAAACIAhk1D' },
  );
*/
