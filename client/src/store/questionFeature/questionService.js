import { neuroHireApi } from '../apiService';

export const questionService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
        if (params?.search) queryParams.append('search', params.search);
        
        return `/questions?${queryParams.toString()}`;
      },
      providesTags: ['Questions'],
    }),
    getQuestionById: builder.query({
      query: (id) => `/questions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Questions', id }],
    }),
    updateQuestionProgress: builder.mutation({
      query: ({ id, status, notes }) => ({
        url: `/questions/${id}/progress`,
        method: 'PUT',
        body: { status, notes },
      }),
      invalidatesTags: ['Questions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useUpdateQuestionProgressMutation,
} = questionService;
