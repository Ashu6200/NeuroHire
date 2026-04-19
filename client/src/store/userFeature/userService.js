import { login, register } from './userSlice';
const { neuroHireApi } = require('../apiService');

const userService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    loginService: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data || !data.user) {
            throw new Error(message || 'Login failed');
          }

          const user = response.data.user;
          const token = response.data.token;
          const { _id, email, name } = user;
          dispatch(login({ user: { _id, email, name }, token: token }));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    registerService: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data || !data.user) {
            throw new Error(message || 'Registration failed');
          }

          const user = data.user;
          const { _id, email } = user;

          dispatch(register({ _id, email }));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    verifyOtpService: builder.mutation({
      query: (otpData) => ({
        url: '/users/verify-otp',
        method: 'POST',
        body: otpData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data || !data.user) {
            throw new Error(message || 'Verification failed');
          }

          const user = data.user;
          const { _id, email } = user;
          dispatch(login({ user: { _id, email }, token: data.token }));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    resendOtpService: builder.mutation({
      query: (email) => ({
        url: '/users/resend-otp',
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to resend OTP');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    getUserService: builder.query({
      query: (id) => `user/${id}`,
      providesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log('User fetched successfully:', data);
          // dispatch(setUser(data));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    updateUserService: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `user/${id}`,
        method: 'PUT',
        body: patch,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log('User updated successfully:', data);
          // dispatch(updateUser(data));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    deleteUserService: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log('User deleted successfully:', data);
          // dispatch(deleteUser(data));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginServiceMutation,
  useRegisterServiceMutation,
  useVerifyOtpServiceMutation,
  useGetUserServiceQuery,
  useUpdateUserServiceMutation,
  useDeleteUserServiceMutation,
} = userService;
