import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Card } from '@mui/material';
import axios from 'axios';
import styles from "./CreateEvent.module.css";
import { EventNote, LocationOn } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

interface EditEventProps {
    isSidebarOpen: boolean;
}

const apiUrl = "http://localhost:3000/api"; // Ensure this matches your backend route

const EditEvent: React.FC<EditEventProps> = ({ isSidebarOpen }) => {
    const { id } = useParams<{ id: string }>(); // Assuming you use React Router to get the event ID from the URL
    const navigate = useNavigate(); // React Router's useNavigate hook for navigation
    const [formWidth, setFormWidth] = useState('100%');
    const [title, setTitle] = useState("");
    const [venue, setVenue] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [address, setAddress] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Adjust form width based on sidebar state
    useEffect(() => {
        setFormWidth(isSidebarOpen ? 'calc(100% - 0px)' : '100%');
    }, [isSidebarOpen]);

    // Fetch event details and populate the form
    useEffect(() => {
        if (id) {
            axios.get(`${apiUrl}/events/${id}`)
                .then(response => {
                    const event = response.data;
                    setTitle(event.title);
                    setVenue(event.venue);
                    setStartDate(event.start.split('T')[0]);
                    setEndDate(event.end.split('T')[0]);
                    setStartTime(event.start.split('T')[1].slice(0, 5)); // Get time in HH:mm format
                    setEndTime(event.end.split('T')[1].slice(0, 5));
                    setAddress(event.address);
                })
                .catch(error => {
                    console.error("Error fetching event details:", error);
                    alert('Failed to load event details. Please try again.');
                });
        }
    }, [id]);

    // Handle form submission for updating event
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (startDateTime >= endDateTime) {
            alert("End time must be after start time.");
            return;
        } else {
            const eventData = {
                title,
                venue,
                start: `${startDate}T${startTime}`,
                end: `${endDate}T${endTime}`,
                address
            };

            axios.put(`${apiUrl}/events/${id}`, eventData)
                .then(response => {
                    console.log("Event updated successfully:", response.data);
                    alert('Event updated successfully!');
                })
                .catch(error => {
                    console.error("Error updating event:", error.response?.data || error.message);
                    alert('Failed to update event. Please try again.');
                });
        }
    };

    // Handle event deletion
    const handleDelete = () => {
        axios.delete(`${apiUrl}/events/${id}`)
            .then(() => {
                alert('Event deleted successfully!');
                navigate('/events'); // Redirect to events list or another page
            })
            .catch(error => {
                console.error("Error deleting event:", error.response?.data || error.message);
                alert('Failed to delete event. Please try again.');
            });
    };

    return (
        <Container className={styles.container}>
            <Card elevation={6} className={styles.card}>
                <Typography fontWeight="bold" variant="h3" align="center" gutterBottom>
                    Edit Event
                </Typography>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Event Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                                aria-label="Event Title"
                                InputProps={{
                                    startAdornment: <EventNote style={{ marginRight: '8px' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Venue"
                                variant="outlined"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                required
                                fullWidth
                                aria-label="Venue"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                variant="outlined"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                aria-label="Start Date"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Time"
                                type="time"
                                variant="outlined"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                aria-label="Start Time"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                variant="outlined"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                aria-label="End Date"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Time"
                                type="time"
                                variant="outlined"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                aria-label="End Time"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                variant="outlined"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                fullWidth
                                aria-label="Address"
                                InputProps={{
                                    startAdornment: <LocationOn style={{ marginRight: '8px' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleDelete}
                                        fullWidth
                                        style={{ marginTop: '20px' }}
                                    >
                                        Delete Event
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                        style={{ marginTop: '20px' }}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Container>
    );
};

export default EditEvent;
