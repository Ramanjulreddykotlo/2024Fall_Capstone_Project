import React, { useState, useEffect } from "react";
import { Bell, X, TrendingDown, TrendingUp } from "lucide-react";

const NotificationCenter = ({ notifications, onDismiss, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "PRICE_DROP":
        return <TrendingDown className="text-green-500" />;
      case "PRICE_INCREASE":
        return <TrendingUp className="text-red-500" />;
      default:
        return <Bell className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button
                onClick={onClearAll}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="font-semibold mb-1">
                          {notification.title}
                        </div>
                        <div className="text-gray-600">
                          {notification.message}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
