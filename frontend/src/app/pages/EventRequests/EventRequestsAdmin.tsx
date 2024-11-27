import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, Button } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './EventRequests.module.css';
import { getEventRequests, deleteEventRequest as deleteEventRequestCall, confirmEventRequest as confirmEventRequestCall, EventRequestUser } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

const EventRequestsAdmin: React.FC = () => {
    const [eventRequests, setEventRequests] = useState<EventRequestUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            getEventRequests(user)
                .then(response => {
                    setEventRequests(response.data);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    const deleteEventRequest = (id: number) => {
        if (!user) return;
        deleteEventRequestCall(id, user)
            .then(() => {
                // remove event request from frontend
                setEventRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            });
    };

    const confirmEventRequest = (id: number) => {
        if (!user) return;
        confirmEventRequestCall(id, user)
            .then(() => {
                // remove event request from frontend
                setEventRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            });
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container className={styles.container}>
            <Grid container spacing={2}>
                {eventRequests.map((eventReq) => (
                    <Grid item xs={12} md={6} lg={4} key={eventReq.id}>
                        <Card className={styles.requestCard}>
                            <Typography variant="h6">
                                <EventNoteIcon /> Event Name: {eventReq.title} {/* Updated to use title */}
                            </Typography>
                            <Typography variant="body1">
                                <PersonIcon /> Requester: 
                                {`${eventReq.first_name} ${eventReq.last_name}`}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Date Requested: 
                                {eventReq.start ? new Date(eventReq.start).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Event Start: 
                                {eventReq.start ? new Date(eventReq.start).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Event End: 
                                {eventReq.end ? new Date(eventReq.end).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Venue:</strong> {eventReq.venue || 'N/A'} {/* Venue field */}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {eventReq.address || 'N/A'} {/* Address field */}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '10px' }}
                                onClick={() => confirmEventRequest(eventReq.id)}
                            >
                                Confirm Request
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                style={{ marginTop: '10px' }}
                                onClick={() => deleteEventRequest(eventReq.id)}
                            >
                                Delete Request
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EventRequestsAdmin;
