import React, { useState, useEffect } from 'react';
import './Notifications.css'; // Make sure to create this CSS file

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      // Replace this with actual API call when you have one
      const mockNotifications: Notification[] = [
        { id: 1, message: "New comment on your post", date: "2023-11-15", read: false },
        { id: 2, message: "You have a new follower", date: "2023-11-14", read: true },
        { id: 3, message: "Your account was logged in from a new device", date: "2023-11-13", read: false },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications at this time.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <small className="notification-date">{notification.date}</small>
              </div>
              {!notification.read && (
                <button 
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
}

export default Notifications;
