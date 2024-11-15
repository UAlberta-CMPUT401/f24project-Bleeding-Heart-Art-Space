import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { NewNotification, Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, createNotification, getVolunteerRoles, isOk } from '@utils/fetch';
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
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (user) {
      getNotifications(user).then(response => {
        console.log("Notifications response:", response);
        if (isOk(response.status)) {
          console.log("Notifications data:", response.data);
          setNotifications(response.data.data);
        } else {
          console.error("Failed to fetch notifications:", response.error);
        }
      });

      getVolunteerRoles(user).then(response => {
        if (isOk(response.status)) {
          setRoles(response.data.map((role: any) => ({ id: role.id, name: role.name })));
        } else {
          console.error("Failed to fetch roles:", response.error);
        }
      });
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    if (user) {
      const response = await markNotificationAsRead(id, user);
      if (isOk(response.status)) {
        setNotifications(notifications.map(n => (n.id === id ? { ...n, is_read: true } : n)));
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
    if (!user || !backendUser || !title || !message || !roleId) {
      alert("All fields are required.");
      return;
    }


    const notificationData: NewNotification = {
      title: title,
      message: message,
      role_name: roles.find(role => role.id === roleId)?.name ?? "",
      is_read: false,
    };

    try {
      const response = await createNotification(notificationData, user);
      if (isOk(response.status)) {
        console.log('Notification created successfully:', response.data);
        setNotifications((prevNotifications) => Array.isArray(prevNotifications) 
        ? [...prevNotifications, response.data] 
        : [response.data]  // If not an array, initialize with the new notification
      );
        setOpen(false);
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
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
      {Array.isArray(notifications) && notifications.length > 0 ? (
        <NotificationsList>
          {notifications.map(notification => (
            <NotificationItem key={notification.id} read={notification.is_read}>
              <NotificationContent>
                <Typography variant="body1">{notification.title}</Typography>
                <Typography variant="body2">{notification.message}</Typography>
                {notification.created_at && (
                  <NotificationDate variant="body2">
                    {new Date(notification.created_at).toLocaleDateString()}
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
      ) : (
        <Typography variant="body1">No notifications found.</Typography>
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
            inputProps={{ "data-gramm": "false" }}
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
            inputProps={{ "data-gramm": "false" }}
          />
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value as string)}
              label="Role"
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
