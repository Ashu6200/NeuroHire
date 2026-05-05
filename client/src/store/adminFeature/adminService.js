import { neuroHireApi } from '../apiService';

const adminService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
    }),
    getAdminUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Admin'],
    }),
    getAdminSubscriptions: builder.query({
      query: () => '/admin/subscriptions',
      providesTags: ['Admin'],
    }),
    getAdminPayments: builder.query({
      query: () => '/admin/payments',
      providesTags: ['Admin'],
    }),
    getAdminUsage: builder.query({
      query: () => '/admin/usage',
      providesTags: ['Admin'],
    }),
    getAdminAuditLogs: builder.query({
      query: () => '/admin/audit-logs',
      providesTags: ['Admin'],
    }),
    grantPlan: builder.mutation({
      query: ({ userId, planCode }) => ({
        url: '/admin/users/grant-plan',
        method: 'POST',
        body: { userId, planCode },
      }),
      invalidatesTags: ['Admin', 'Billing'],
    }),
    setUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: '/admin/users/set-role',
        method: 'POST',
        body: { userId, role },
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminAuditLogsQuery,
  useGetAdminDashboardQuery,
  useGetAdminPaymentsQuery,
  useGetAdminSubscriptionsQuery,
  useGetAdminUsageQuery,
  useGetAdminUsersQuery,
  useGrantPlanMutation,
  useSetUserRoleMutation,
} = adminService;
