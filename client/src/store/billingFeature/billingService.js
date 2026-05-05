import { neuroHireApi } from '../apiService';

const billingService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingPlans: builder.query({
      query: () => '/billing/plans',
      providesTags: ['Billing'],
    }),
    getMyBilling: builder.query({
      query: () => '/billing/me',
      providesTags: ['Billing'],
    }),
    createSubscription: builder.mutation({
      query: (planCode) => ({
        url: '/billing/create-subscription',
        method: 'POST',
        body: { planCode },
      }),
      invalidatesTags: ['Billing'],
    }),
    cancelSubscription: builder.mutation({
      query: () => ({
        url: '/billing/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useGetBillingPlansQuery,
  useGetMyBillingQuery,
} = billingService;
