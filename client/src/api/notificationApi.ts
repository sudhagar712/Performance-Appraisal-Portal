import { apiSlice } from "./apiSlice";
import type { NotificationListResponse, MarkReadResponse } from "../types";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse, void>({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),

    markRead: builder.mutation<MarkReadResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkReadMutation } =
  notificationApi;
