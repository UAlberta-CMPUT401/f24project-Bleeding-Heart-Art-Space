import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Button, Card, Container } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import styles from './EventDetails.module.css';
import { getVolunteerRoles, Shift, VolunteerRole } from '@utils/fetch';

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);

    useEffect(() => {
        if (id) {
            getVolunteerRoles().then(response => setRoles(response.data));
            axios.get(`${apiUrl}/events/${id}`)
                .then(response => {
                    setEvent(response.data);
                })
                .catch(error => {
                    console.error("Error fetching event details:", error);
                    alert('Failed to load event details. Please try again.');
                });

            axios.get(`${apiUrl}/events/${id}/volunteer_shifts`)
                .then(response => setShifts(response.data))
                .catch(error => {
                    console.error("Error fetching shifts:", error);
                });
        }
    }, [id]);

    const handleEdit = () => {
        navigate(`/edit-event/${id}`);
    };

    const handleGoToShifts = () => {
        navigate(`/volunteer-shifts/${id}`);
    };

    return (
        <Container className={styles.container}>
            <Card elevation={6} className={styles.card}>
                {/* Event Header Section */}
                <Typography variant="h4" align="center" gutterBottom>
                    {event?.title}
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    {/* Event Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" align="center">
                            <AccessTimeIcon /> Start Date/Time: {new Date(event?.start).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" align="center">
                            <AccessTimeIcon /> End Date/Time: {new Date(event?.end).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            <EventIcon /> Event: {event?.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            <PlaceIcon /> Venue: {event?.venue}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            Address: {event?.address}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Created Shifts Section */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                    Created Shifts
                </Typography>
                <Grid container spacing={2}>
                    {shifts.map((shift, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card className={styles.shiftCard}>
                                <Typography variant="h6">
                                    <AssignmentIndIcon /> Role: {roles.find(item => item.id === shift.volunteer_role)?.name}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> Start: {new Date(shift.start).toLocaleTimeString()}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> End: {new Date(shift.end).toLocaleTimeString()}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Manage Shifts and Edit Event Buttons */}
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleGoToShifts}
                            fullWidth
                        >
                            Manage Volunteer Shifts
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEdit}
                            fullWidth
                        >
                            Edit Event
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};

export default EventDetails;
