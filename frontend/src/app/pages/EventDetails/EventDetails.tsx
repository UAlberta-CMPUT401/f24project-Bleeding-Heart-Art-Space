import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Typography, Card, Grid, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { EventNote, LocationOn } from '@mui/icons-material';
import styles from './EventDetails.module.css'; // Add relevant CSS styles here

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]); // Track created shifts
    const [savedShifts, setSavedShifts] = useState<any[]>([]); // Track fetched saved shifts
    const [newShift, setNewShift] = useState({
        volunteer_role: '',
        start: '',
        end: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`${apiUrl}/events/${id}`)
                .then(response => {
                    setEvent(response.data);
                    
                    // Default new shift times to match event start and end times
                    setNewShift(prev => ({
                        ...prev,
                        start: response.data.start,
                        end: response.data.end
                    }));
                })
                .catch(error => {
                    console.error("Error fetching event details:", error);
                    alert('Failed to load event details. Please try again.');
                });

            // Fetch admin's roles for the event
            axios.get(`${apiUrl}/volunteer_roles`)
                .then(response => setRoles(response.data))
                .catch(error => {
                    console.error("Error fetching roles:", error);
                });

            // Fetch saved shifts for the event
            axios.get(`${apiUrl}/events/${id}/volunteer_shifts`)
                .then(response => {
                    setSavedShifts(response.data); // Store fetched shifts
                })
                .catch(error => {
                    console.error("Error fetching saved shifts:", error);
                });
        }
    }, [id]);

    const handleAddShift = () => {
        // Validate the new shift data
        if (!newShift.volunteer_role || !newShift.start || !newShift.end) {
            alert('Please fill in all shift details.');
            return;
        }

        // Add shift to the local state
        setShifts([...shifts, newShift]);

        // Reset the newShift form (keep event times as default)
        setNewShift(prev => ({
            volunteer_role: '',
            start: event.start,
            end: event.end
        }));
    };

    const handleSaveShifts = () => {
        // Save shifts to the backend
        axios.post(`${apiUrl}/events/${id}/volunteer_shifts`, { shifts })
            .then(response => {
                alert('Shifts successfully saved!');
                // Fetch saved shifts again after saving
                fetchSavedShifts();
            })
            .catch(error => {
                console.error('Error saving shifts:', error);
                alert('Failed to save shifts. Please try again.');
            });
    };

    const fetchSavedShifts = () => {
        axios.get(`${apiUrl}/events/${id}/volunteer_shifts`)
            .then(response => {
                setSavedShifts(response.data); // Store fetched shifts
            })
            .catch(error => {
                console.error("Error fetching saved shifts:", error);
            });
    };

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
                </Grid>
                {/* Shifts Creation Section */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                    Create Shifts
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newShift.volunteer_role}
                                onChange={(e) => setNewShift({ ...newShift, volunteer_role: e.target.value })}
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Start Time"
                            type="datetime-local"
                            fullWidth
                            value={newShift.start}
                            onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="End Time"
                            type="datetime-local"
                            fullWidth
                            value={newShift.end}
                            onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                        />
                    </Grid>
                </Grid>
                
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddShift}
                    style={{ marginTop: '20px' }}
                >
                    Add Shift
                </Button>

                {/* Display created shifts */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Created Shifts:
                </Typography>
                {shifts.map((shift, index) => (
                    <Typography key={index} variant="body1">
                        Role: {shift.volunteer_role}, Start: {new Date(shift.start).toLocaleString()}, End: {new Date(shift.end).toLocaleString()}
                    </Typography>
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveShifts}
                    style={{ marginTop: '20px' }}
                    fullWidth
                >
                    Save Shifts
                </Button>

                {/* Display saved shifts */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '40px' }}>
                    Saved Shifts:
                </Typography>
                {savedShifts.map((shift, index) => (
                    <Typography key={index} variant="body1">
                        Role: {shift.volunteer_role}, Start: {new Date(shift.start).toLocaleString()}, End: {new Date(shift.end).toLocaleString()}
                    </Typography>
                ))}

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
