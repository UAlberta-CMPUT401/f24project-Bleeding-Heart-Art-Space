import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Typography, Card, Grid } from '@mui/material';
import { EventNote, LocationOn } from '@mui/icons-material';
import styles from './EventDetails.module.css'; // Add relevant CSS styles here

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${apiUrl}/events/${id}`)
                .then(response => {
                    setEvent(response.data);
                })
                .catch(error => {
                    console.error("Error fetching event details:", error);
                    alert('Failed to load event details. Please try again.');
                });
        }
    }, [id]);

    if (!event) {
        return <Typography>Loading event details...</Typography>;
    }

    const handleEdit = () => {
        navigate(`/edit-event/${id}`);
    };

    return (
        <Container className={styles.container}>
            <Card elevation={6} className={styles.card}>
                <Typography variant="h3" align="center" gutterBottom>
                    {event.title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            <EventNote style={{ marginRight: '8px' }} />
                            Event: {event.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            <LocationOn style={{ marginRight: '8px' }} />
                            Venue: {event.venue}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Address: {event.address}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">
                            Start Date/Time: {new Date(event.start).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">
                            End Date/Time: {new Date(event.end).toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Edit Event
                </Button>
            </Card>
        </Container>
    );
};

export default EventDetails;
