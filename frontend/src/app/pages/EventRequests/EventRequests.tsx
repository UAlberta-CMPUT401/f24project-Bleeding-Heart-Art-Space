import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Typography, Button } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './EventRequests.module.css';

const apiUrl = import.meta.env.VITE_API_URL;

const EventRequests: React.FC = () => {
    const [eventRequests, setEventRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${apiUrl}/event_requests`)
            .then(response => {
                console.log(response.data); // Log the structure of the data
                setEventRequests(response.data);
            })
            .catch(error => {
                console.error('Error fetching event requests:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    const deleteEventRequest = (id: number) => {
        axios.delete(`${apiUrl}/event_requests/${id}`)
            .then(() => {
                // Filter out the deleted event from the state
                setEventRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            })
            .catch(error => {
                console.error('Error deleting event request:', error);
            });
    };

    const confirmEventRequest = (request: any) => {
        const eventData = {
            title: request.title,
            venue: request.venue,
            start: request.start,  // Assuming start and end are in correct ISO format
            end: request.end,
            address: request.address,
        };

        axios.post(`${apiUrl}/events`, eventData)
            .then(response => {
                console.log("Event created successfully:", response.data);
                alert('Event created successfully!');

                // Optionally delete the request after confirmation
                deleteEventRequest(request.id);
            })
            .catch(error => {
                console.error('Error creating event:', error);
                alert('Failed to create event. Please try again.');
            });
    };

    if (loading) return <Typography>Loading...</Typography>;

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
                                <EventNoteIcon /> Event Name: {request.title} {/* Updated to use title */}
                            </Typography>
                            <Typography variant="body1">
                                <PersonIcon /> Requester: 
                                {request.requester ? `${request.requester.firstName} ${request.requester.lastName}` : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Date Requested: 
                                {request.start ? new Date(request.start).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Event Start: 
                                {request.start ? new Date(request.start).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <CalendarTodayIcon /> Event End: 
                                {request.end ? new Date(request.end).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Venue:</strong> {request.venue || 'N/A'} {/* Venue field */}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {request.address || 'N/A'} {/* Address field */}
                            </Typography>
                            <Typography variant="body1">
                                Status: {request.status === 'pending' ? (
                                    <PendingIcon style={{ color: 'orange' }} /> 
                                ) : (
                                    <DoneIcon style={{ color: 'green' }} />
                                )}
                                {request.status}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '10px' }}
                                onClick={() => confirmEventRequest(request)}
                            >
                                Confirm Request
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                style={{ marginTop: '10px' }}
                                onClick={() => deleteEventRequest(request.id)}
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

export default EventRequests;
