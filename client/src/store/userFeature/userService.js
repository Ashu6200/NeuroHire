const { neuroHireApi } = require('../apiService');

const userService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserService: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
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
      query: (patch) => ({
        url: '/users/update-profile',
        method: 'PUT',
        body: patch,
      }),

      async onQueryStarted(_arg, { queryFulfilled }) {
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
      query: (body) => ({
        url: '/users/delete-profile',
        method: 'DELETE',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
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
  useGetUserServiceQuery,
  useUpdateUserServiceMutation,
  useDeleteUserServiceMutation,
} = userService;
