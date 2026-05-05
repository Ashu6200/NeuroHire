import { neuroHireApi } from '../apiService';

const resumeService = neuroHireApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyResumes: builder.query({
      query: () => '/resume',
      providesTags: ['Resume'],
    }),
    getResumeById: builder.query({
      query: (id) => `/resume/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Resume', id }],
    }),
    createResume: builder.mutation({
      query: (body) => ({
        url: '/resume',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resume'],
    }),
    updateResume: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/resume/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => ['Resume', { type: 'Resume', id }],
    }),
    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/resume/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
    publishResume: builder.mutation({
      query: (id) => ({
        url: `/resume/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _err, id) => ['Resume', { type: 'Resume', id }],
    }),
    unpublishResume: builder.mutation({
      query: (id) => ({
        url: `/resume/${id}/unpublish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _err, id) => ['Resume', { type: 'Resume', id }],
    }),
    getPublicTemplates: builder.query({
      query: ({ category, tag, page = 1 } = {}) => {
        const params = new URLSearchParams({ page });
        if (category) params.set('category', category);
        if (tag) params.set('tag', tag);
        return `/resume/templates?${params.toString()}`;
      },
      providesTags: ['ResumeTemplates'],
    }),
    useTemplate: builder.mutation({
      query: (id) => ({
        url: `/resume/templates/${id}/use`,
        method: 'POST',
      }),
      invalidatesTags: ['Resume'],
    }),
    exportResumePdf: builder.query({
      query: (id) => ({
        url: `/resume/${id}/export-pdf`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetMyResumesQuery,
  useGetResumeByIdQuery,
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  usePublishResumeMutation,
  useUnpublishResumeMutation,
  useGetPublicTemplatesQuery,
  useUseTemplateMutation,
  useLazyExportResumePdfQuery,
} = resumeService;
