import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { getEvents } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { postData } from '@utils/fetch';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  // Fetch events using the existing getEvents function
  useEffect(() => {
    const fetchAllEvents = async () => {
      if (user) {
        const response = await getEvents(user);
        if (response.status === 200) {
          setEvents(response.data);
        } else {
          setErrorMessage('Failed to fetch events.');
        }
      }
    };
    fetchAllEvents();
  }, [user]);

  // Function to send custom emails
  const handleSendEmail = async () => {
    if (!selectedEvent || !subject || !message) {
      setErrorMessage('Please fill all fields.');
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
        setSuccessMessage('Emails sent successfully!');
        setErrorMessage('');
        setSubject('');
        setMessage('');
        setSelectedEvent('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to send emails.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      setSuccessMessage('');
    }
  };
  const handleSendEmails = async () => {
    console.log('Sending email payload to the backend');

    try {
      const response = await postData('/send_emails/today', {});
      if (response.status === 200) {
        alert('Emails sent successfully to volunteers!');
      } else {
        alert(`Failed to send emails: ${response.error}`);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('An unexpected error occurred.');
    }
  };


  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Send Custom Email to Volunteers
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Event</InputLabel>
        <Select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
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
      />

      <TextField
        fullWidth
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        rows={4}
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSendEmail}>
        Send Email
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendEmails}
        style={{ marginTop: '20px' }}
        >
        Send Emails for Today’s Shifts
        </Button>
        {/* <Button
            variant="contained"
            color="secondary"
            onClick={() => handleViewDetailsClick(shift)}
        >
            View Details
        </Button> */}

      {successMessage && <Typography color="green">{successMessage}</Typography>}
      {errorMessage && <Typography color="red">{errorMessage}</Typography>}
    </Container>
  );
};

export default CustomEventEmail;
