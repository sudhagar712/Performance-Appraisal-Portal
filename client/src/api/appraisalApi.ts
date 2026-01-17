import { apiSlice } from "./apiSlice";
import type {
  CreateDraftRequest,
  CreateDraftResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  SubmitResponse,
  ManagerSubmissionsResponse,
  GetAppraisalResponse,
  Appraisal,
} from "../types";

export const appraisalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDraft: builder.mutation<CreateDraftResponse, CreateDraftRequest>({
      query: (body) => ({
        url: "/appraisals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Appraisal"],
    }),

    saveDraft: builder.mutation<
      SaveDraftResponse,
      { id: string; body: SaveDraftRequest }
    >({
      query: ({ id, body }) => ({
        url: `/appraisals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Appraisal"],
    }),

    submitSelf: builder.mutation<SubmitResponse, string>({
      query: (id) => ({
        url: `/appraisals/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["Appraisal"],
    }),

    managerSubmissions: builder.query<ManagerSubmissionsResponse, void>({
      query: () => "/appraisals",
      providesTags: ["Appraisal"],
    }),

    getAppraisalById: builder.query<GetAppraisalResponse, string>({
      query: (id) => `/appraisals/${id}`,
      providesTags: ["Appraisal"],
    }),

    employeeAppraisals: builder.query<{ success: boolean; appraisals: Appraisal[] }, void>({
      query: () => "/appraisals/employee",
      providesTags: ["Appraisal"],
    }),

    managerReview: builder.mutation<
      SubmitResponse,
      { id: string; body: SaveDraftRequest }
    >({
      query: ({ id, body }) => ({
        url: `/appraisals/${id}/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Appraisal"],
    }),
  }),
});

export const {
  useCreateDraftMutation,
  useSaveDraftMutation,
  useSubmitSelfMutation,
  useManagerSubmissionsQuery,
  useGetAppraisalByIdQuery,
  useEmployeeAppraisalsQuery,
  useManagerReviewMutation,
} = appraisalApi;
