import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Typography, Button } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/CheckCircle';
import styles from './EventRequests.module.css';

const apiUrl = import.meta.env.VITE_API_URL;

const EventRequests: React.FC = () => {
    const [eventRequests, setEventRequests] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`${apiUrl}/event_requests`)
            .then(response => setEventRequests(response.data))
            .catch(error => {
                console.error('Error fetching event requests:', error);
            });
    }, []);

    return (
        <Container className={styles.container}>
            <Typography variant="h4" gutterBottom>
                Event Requests
            </Typography>

            <Grid container spacing={2}>
                {eventRequests.map((request) => (
                    <Grid item xs={12} md={6} lg={4} key={request.id}>
                        <Card className={styles.requestCard}>
                            <Typography variant="h6">
                                <EventNoteIcon /> Event Name: {request.event_name}
                            </Typography>
                            <Typography variant="body1">
                                <PersonIcon /> Requester: {request.requester}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Date Requested: {new Date(request.date_requested).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                                Status: {request.status === 'pending' ? (
                                    <PendingIcon style={{ color: 'orange' }} /> 
                                ) : (
                                    <DoneIcon style={{ color: 'green' }} />
                                )}
                                {request.status}
                            </Typography>

                            <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                View Details
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EventRequests;
