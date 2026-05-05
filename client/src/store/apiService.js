import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { triggerUpgradeModal } from './uiFeature/uiSlice';
import { toast } from 'sonner';

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1`;
const isHydrateAction = (action) => action.type === HYDRATE;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});
const baseQueryWithTokenExpiryCheck = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 402) {
      const message = result.error.data?.message || 'Upgrade your plan to continue.';
      api.dispatch(triggerUpgradeModal({ message }));
      return { data: null };
    }
    if (result.error) {
      const { status, data } = result.error;
      const message = data?.message || 'Something went wrong';
      toast.error(`Error ${status}: ${message}`);
    }
    return result;
  } catch (error) {
    console.error('Unhandled error in baseQueryWithTokenExpiryCheck:', error);
    toast.error('Unexpected error occurred');
    return { error: { status: 500, data: 'Unexpected error' } };
  }
};

export const neuroHireApi = createApi({
  reducerPath: 'neuroHireApi',
  baseQuery: baseQueryWithTokenExpiryCheck,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Admin', 'Billing', 'User', 'MockInterviewQuestions', 'Resume', 'ResumeTemplates', 'Questions'],
  endpoints: (build) => ({
    getLiveStatus: build.query({
      query: () => '/api/live',
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.info('✅ [Live] Data fetched:', data);
        } catch (error) {
          console.warn('❌ [Live] Data fetch failed:', error);
        }
      },
    }),
  }),
});

export const { useGetLiveStatusQuery } = neuroHireApi;
