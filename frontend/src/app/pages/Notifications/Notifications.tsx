import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

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
  backgroundColor: read ? theme.palette.notification.read : theme.palette.notification.unread,
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
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await getNotifications(user);
          if (isOk(response.status)) {
            setNotifications(response.data);
          } else {
            console.error("Failed to fetch notifications:", response.error);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      } else {
        console.warn("No user provided for fetching notifications.");
      }
    };
    fetchNotifications();
    console.log(user)
  }, [user]);

  const markAsRead = async (id: number) => {
    if (user) {
      const response = await markNotificationAsRead(id, user);
      if (isOk(response.status)) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      } else {
        console.error("Failed to mark notification as read:", response.error);
      }
    }
  };

  const markAllAsRead = async () => {
    if (user) {
      const response = await markAllNotificationsAsRead(user);
      if (isOk(response.status)) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } else {
        console.error("Failed to mark all notifications as read:", response.error);
      }
    }
  };

  return (
    <NotificationsContainer>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      
      {notifications.length === 0 ? (
        <p>No notifications at this time.</p>
      ) : (
        <>
          <Button variant="outlined" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <NotificationsList>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} read={notification.is_read}>
                <NotificationContent>
                  <Typography variant="body1">{notification.title}</Typography>
                  <Typography variant="body2">{notification.message}</Typography>
                  <NotificationDate variant="body2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </NotificationDate>
                </NotificationContent>
                {!notification.is_read && (
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
        </>
      )}
    </NotificationsContainer>
  );
};

export default Notifications;
