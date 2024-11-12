import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

// Styled components
const NotificationsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  maxWidth: '800px',
  margin: '0 auto',
}));

const NotificationsList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

const NotificationItem = styled('li')<{ read: boolean }>(({ theme, read }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
  backgroundColor: read 
    ? theme.palette.notification.read 
    : theme.palette.notification.unread,
  borderRadius: theme.shape.borderRadius,
}));

const NotificationContent = styled(Box)({
  flexGrow: 1,
});

const MarkReadButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  whiteSpace: 'nowrap',
}));


const NotificationDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

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
    <NotificationsContainer>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      
      {notifications.length === 0 ? (
        <p>
          No notifications at this time.
        </p>
      ) : (
        <NotificationsList>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              read={notification.read}
            >
              <NotificationContent>
                <Typography variant="body1">
                  {notification.message}
                </Typography>
                <NotificationDate variant="body2">
                  {notification.date}
                </NotificationDate>
              </NotificationContent>
              
              {!notification.read && (
                <MarkReadButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </MarkReadButton>
              )}
            </NotificationItem>
          ))}
        </NotificationsList>
      )}
    </NotificationsContainer>
  );
};

export default Notifications;
