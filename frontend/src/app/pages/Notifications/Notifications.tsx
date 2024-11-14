import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { NewNotification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, createNotification, isOk } from '@utils/fetch';
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
  
  const [notifications, setNotifications] = useState<NewNotification[]>([]);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { backendUser } = useBackendUserStore();

  useEffect(() => {
    if (user) {
      getNotifications(user).then(response => {
        if (isOk(response.status)) {
          console.log(response.data);
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
          Array.isArray(prevNotifications) ? prevNotifications.map(n => 
            n.id === id ? { ...n, is_read: true } : n) 
          : [] // Fallback to empty array if prevNotifications is not iterable
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

    if (!user) {
      console.error("User not found.");
      return;
    }

    if (!backendUser) {
      console.error("Backend user not found.");
      return;
    }

    if (!title || !message) {
      alert("Title and message are required.");
      return;
    }

    const notifData: NewNotification = {
      id: 0, // Temporary id, will be replaced by the backend
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    createNotification(notifData, user).then(response => {
      if (isOk(response.status)) {
        setNotifications([...notifications, response.data]);
        setOpen(false);
      } else {
        console.error("Failed to create notification:", response.error);
      }
    }
    );

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
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginLeft: '16px' }}>
            Create Notification
          </Button>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            <NotificationsList>
              {notifications.map((notification) => (
                <NotificationItem key={notification?.id} read={notification?.is_read}>
                  <NotificationContent>
                    <Typography variant="body1">{notification?.title || "Untitled Notification"}</Typography>
                    <Typography variant="body2">{notification?.message || "No message available"}</Typography>
                    <NotificationDate variant="body2">
                      {notification?.created_at ? new Date(notification.created_at).toLocaleDateString() : "Date unavailable"}
                    </NotificationDate>
                  </NotificationContent>
                  {!notification?.is_read && (
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
          ) : (
            <p>No notifications at this time.</p>
          )}
        </>
      )}

      {/* Modal for creating notification */}
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