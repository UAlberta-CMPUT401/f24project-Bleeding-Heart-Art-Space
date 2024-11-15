import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { NewNotification, Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, createNotification, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';

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
  const { backendUser } = useBackendUserStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [role_name, setRoleName] = useState("");

  useEffect(() => {
    if (user) {
      getNotifications(user).then(response => {
        if (isOk(response.status)) {
          setNotifications(response.data);
        } else {
          console.error("Failed to fetch notifications:", response.error);
        }
      });
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    if (user) {
      const response = await markNotificationAsRead(id, user);
      if (isOk(response.status)) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
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

  const handleCreateNotification = async () => {
    if (!user || !backendUser || !title || !message) {
      alert("All fields are required.");
      return;
    }

    const notifData: NewNotification = {
      title,
      message,
      role_name,
    };

    const response = await createNotification(notifData, user);
    if (isOk(response.status)) {
      setNotifications([...notifications, response.data]);
      setOpen(false);
    } else {
      console.error("Failed to create notification:", response.error);
    }
  };

  return (
    <NotificationsContainer>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <Button variant="outlined" onClick={markAllAsRead}>
        Mark All as Read
      </Button>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginLeft: '16px' }}>
        Create Notification
      </Button>
      
      {notifications.length === 0 ? (
        <Typography>No notifications at this time.</Typography>
      ) : (
        <NotificationsList>
          {notifications.map(notification => (
            <NotificationItem key={notification?.id ?? Math.random()} read={notification.is_read}>
              <NotificationContent>
                <Typography variant="body1">{notification?.title}</Typography>
                <Typography variant="body2">{notification?.message}</Typography>
                {notification.created_at && (
                  <NotificationDate variant="body2">
                    {new Date(notification?.created_at).toLocaleDateString()}
                  </NotificationDate>
                )}
              </NotificationContent>
              {!notification.is_read && (
                <MarkReadButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => markAsRead(notification.id ?? 0)}
                >
                  Mark as Read
                </MarkReadButton>
              )}
            </NotificationItem>
          ))}
        </NotificationsList>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateNotification} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationsContainer>
  );
};

export default Notifications;
