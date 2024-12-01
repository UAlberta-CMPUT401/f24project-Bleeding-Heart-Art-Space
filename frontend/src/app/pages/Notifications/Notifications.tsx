import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Paper,
  Container,
} from '@mui/material';
import { getEvents, postData } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import styles from '@pages/Notifications/Notifications.module.css';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import SnackbarAlert from '@components/SnackbarAlert';

interface Event {
  id: number;
  title: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

const CustomEventEmail: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');  

  useEffect(() => {
    const fetchAllEvents = async () => {
      if (user) {
        const response = await getEvents(user);
        if (response.status === 200) {
          setEvents(response.data);
        } else {
          setSnackbarMessage('Failed to fetch events.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };
    fetchAllEvents();
  }, [user]);

  const handleSendEmail = async () => {
    if (!selectedEvent || !subject.trim() || !message.trim()) {
      setSnackbarMessage('Please fill all fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = user ? await user.getIdToken() : null;
      const response = await fetch(
        `${BASE_URL}/send_emails/event/${selectedEvent}/send_custom_email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subject, message }),
        }
      );

      if (response.ok) {
        setSnackbarMessage('Email sent successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);  
        setSubject('');
        setMessage('');
        setSelectedEvent('');
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || `Failed to send emails. No volunteers found for the selected event.`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('An unexpected error occurred.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSendEmails = async () => {
    try {
      console.log('Initiating email send for today’s shifts...');
      const response = await postData('/send_emails/today', {});

      if (response.status === 200) {
        setSnackbarMessage("Emails successfully sent to all volunteers for today's shifts!");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(`Failed to send emails. Reason: ${response.error || 'Unknown error'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('An unexpected error occurred while sending emails.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        Custom Email Service
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Use this page to send custom emails to volunteers signed up to any shift for a particular event or send a bulk email for all shifts that start today.
      </Typography>

      {/* Custom Event Email Form */}
      <Paper
        component="form"
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          p: 4,
          mb: 4,
        }}
        elevation={6}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Send Custom Event Email
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Event</InputLabel>
          <Select
            label="Select Event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
          >
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          margin="normal"
          required
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (!selectedEvent || !subject || !message) {
              setSnackbarMessage('Please fill all fields.');
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
              return;
            }
            setConfirmationMessage(
              'Are you sure you want to send this email for the selected event?'
            );
            setOnConfirmAction(() => handleSendEmail);
            setOpenConfirmationDialog(true);
          }}
          sx={{ mt: 2 }}
          disabled={!selectedEvent || !subject || !message}
        >
          Send Email
        </Button>
      </Paper>

      <Divider sx={{ my: 4, borderBottomWidth: 3 }} />

      {/* Bulk Email Section */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          p: 4,
        }}
        elevation={6}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Bulk Email for Today’s Shifts
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Notify all existing volunteers about all shifts that start today for any event.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setConfirmationMessage(
              "Are you sure you want to send a bulk email?"
            );
            setOnConfirmAction(() => handleSendEmails);
            setOpenConfirmationDialog(true);
          }}
        >
          Send Emails for Today’s Shifts
        </Button>

      </Paper>
      <ConfirmationDialog
        open={openConfirmationDialog}
        message={confirmationMessage}
        onConfirm={() => {
          if (onConfirmAction) {
            onConfirmAction();
          }
          setOpenConfirmationDialog(false);
        }}
        onCancel={() => setOpenConfirmationDialog(false)}
        title="Confirm Send"
        confirmButtonText="Confirm"
      />
      <SnackbarAlert
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default CustomEventEmail;
