import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Clock, RefreshCw, CheckCheck } from "lucide-react";
import { useGetNotificationsQuery, useMarkReadMutation } from "../../api/notificationApi";
import { useAppSelector } from "../../app/hooks";
import type { Notification as NotificationType } from "../../types";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { data, isLoading, error, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated || !user,
  });
  const [markRead] = useMarkReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Log error for debugging
  useEffect(() => {
    if (error) {
      console.error("Notification error:", error);
    }
  }, [error]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      await Promise.all(unreadNotifications.map((n) => markRead(n._id).unwrap()));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUBMITTED":
        return "📝";
      case "REVIEWED":
        return "✅";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SUBMITTED":
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700";
      case "REVIEWED":
        return "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-all duration-200 group touch-manipulation"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg animate-pulse ring-1 sm:ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {unreadCount === 0 && isOpen && (
          <span className="absolute inset-0 rounded-xl bg-blue-100 opacity-20 animate-ping" />
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-end sm:pt-16 sm:pr-4 pt-0 pr-0 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[100vh] sm:h-auto sm:max-h-[85vh] flex flex-col border border-gray-100 animate-slideInMobile sm:animate-slideIn overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Notifications</h2>
                    {unreadCount > 0 && (
                      <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                        {unreadCount} new {unreadCount === 1 ? "notification" : "notifications"}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors active:bg-white/30"
                  title="Close notifications"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 sm:pb-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-4">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                  </div>
                  <p className="text-red-600 text-xs sm:text-sm font-semibold text-center">Failed to load notifications</p>
                  <p className="text-gray-500 text-xs mt-2 text-center max-w-xs">
                    {(() => {
                      if (error && 'status' in error) {
                        const status = typeof error.status === 'number' ? error.status : parseInt(String(error.status), 10);
                        if (status === 401) {
                          return "Authentication required. Please log in again.";
                        }
                        if (status === 403) {
                          return "You don't have permission to view notifications.";
                        }
                        if (status === 404) {
                          return "Notifications endpoint not found.";
                        }
                        if (status >= 500) {
                          return "Server error. Please try again later.";
                        }
                        if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
                          return (error.data as { message: string }).message;
                        }
                        return `Error ${status}: ${'data' in error ? JSON.stringify(error.data) : 'Unknown error'}`;
                      }
                      return "Please check your connection and try again.";
                    })()}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-4 px-5 py-3 sm:py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2 shadow-md touch-manipulation"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base font-semibold">All caught up!</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">You have no notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification: NotificationType) => (
                    <div
                      key={notification._id}
                      className={`p-3 sm:p-4 active:bg-gray-100 sm:hover:bg-gray-50 transition-all duration-200 cursor-pointer group touch-manipulation ${
                        !notification.isRead ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "bg-white"
                      }`}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${
                          !notification.isRead 
                            ? "bg-blue-100 ring-2 ring-blue-200" 
                            : "bg-gray-100"
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2 mb-2">
                            <span
                              className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold border w-fit ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              {notification.type}
                            </span>
                            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {formatDate(notification.createdAt)}
                            </div>
                          </div>
                          <p className="text-gray-800 text-xs sm:text-sm leading-relaxed font-medium break-words">
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors sm:group-hover:underline touch-manipulation py-1"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              Mark as read
                            </button>
                          )}
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full mt-2 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 safe-area-bottom">
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md hover:shadow-lg touch-manipulation"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInMobile {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slideInMobile {
          animation: slideInMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default Notification;

