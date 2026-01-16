export type NotificationType = "SUBMITTED" | "REVIEWED";

export interface Notification {
  _id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  notifications: Notification[];
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
}
