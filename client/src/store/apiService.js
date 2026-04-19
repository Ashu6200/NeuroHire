import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { jwtDecode } from 'jwt-decode';
import { logout } from './userFeature/userSlice';
import { toast } from 'sonner';

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1`;
const isHydrateAction = (action) => action.type === HYDRATE;

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (e) {
    console.warn('Failed to decode token:', e);
    return true;
  }
};
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState();
    const token = state.userStore?.token;

    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    const publicEndpoints = [
      'loginService',
      'registerService',
      'verifyOtpService',
      'getLiveStatus',
    ];
    if (!publicEndpoints.includes(endpoint) && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithTokenExpiryCheck = async (args, api, extraOptions) => {
  try {
    const state = api.getState();
    const token = state.userStore.token;
    if (token && isTokenExpired(token)) {
      api.dispatch(logout());
      return { error: { status: 401, data: 'Token expired, logging out.' } };
    }
    const result = await baseQuery(args, api, extraOptions);
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
  tagTypes: ['User', 'MockInterviewQuestions'],
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
