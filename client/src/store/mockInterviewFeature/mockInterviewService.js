import { neuroHireApi } from '../apiService';

const mockInterviewService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMockInterview: builder.query({
      query: () => ({
        url: '/mock-interview/all',
        credentials: 'include',
      }),
      providesTags: ['MockInterviewQuestions'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(
              message || 'Failed to fetch mock interview questions'
            );
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    getMockInterviewById: builder.query({
      query: (id) => ({
        url: `/mock-interview/${id}`,
        credentials: 'include',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to fetch the question');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    getMockInterviewQuestions: builder.query({
      query: (id) => ({
        url: `/mock-interview/${id}/questions`,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(
              message || 'Failed to fetch mock interview questions'
            );
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    createMockInterview: builder.mutation({
      query: (interviewData) => ({
        url: '/mock-interview/create',
        method: 'POST',
        body: interviewData,
        credentials: 'include',
      }),
      invalidatesTags: ['MockInterviewQuestions'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to create mock interview');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    updateMockInterview: builder.mutation({
      query: ({ id, interviewData }) => ({
        url: `/mock-interview/update/${id}`,
        method: 'PATCH',
        body: interviewData,
        credentials: 'include',
      }),
      invalidatesTags: ['MockInterviewQuestions'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to update mock interview');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    regenerateQuestionSet: builder.mutation({
      query: (id) => ({
        url: `/mock-interview/regenerate-questions/${id}`,
        method: 'PATCH',
        credentials: 'include',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to regenerate questions');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    deleteMockInterview: builder.mutation({
      query: (id) => ({
        url: `/mock-interview/delete/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['MockInterviewQuestions'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message } = response;
          if (!success) {
            throw new Error(message || 'Failed to delete mock interview');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
  }),
});

export const {
  useGetAllMockInterviewQuery,
  useGetMockInterviewByIdQuery,
  useGetMockInterviewQuestionsQuery,
  useCreateMockInterviewMutation,
  useUpdateMockInterviewMutation,
  useRegenerateQuestionSetMutation,
  useDeleteMockInterviewMutation,
} = mockInterviewService;
