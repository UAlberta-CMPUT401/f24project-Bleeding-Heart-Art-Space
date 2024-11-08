import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Card, IconButton } from '@mui/material';
import styles from "./EditEvent.module.css";
import { EventNote, LocationOn, Close } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteEvent, getEvent, isOk, NewEvent, putEvent } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

interface EditEventProps {
    isSidebarOpen: boolean;
}

const EditEvent: React.FC<EditEventProps> = ({ isSidebarOpen }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formWidth, setFormWidth] = useState('100%');
    const [title, setTitle] = useState("");
    const [venue, setVenue] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [address, setAddress] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { user } = useAuth();

    // Adjust form width based on sidebar state
    useEffect(() => {
        setFormWidth(isSidebarOpen ? 'calc(100% - 0px)' : '100%');
    }, [isSidebarOpen]);

    // Fetch event details and populate the form
    useEffect(() => {
        if (id && user) {
            getEvent(Number(id), user)
                .then(response => {
                    if (isOk(response.status)) {
                        const event = response.data;

                        const startUTC = new Date(event.start);
                        const endUTC = new Date(event.end);
                        const startDateLocal = startUTC.toLocaleDateString('en-CA');
                        const startTimeLocal = startUTC.toTimeString().slice(0, 5);
                        const endDateLocal = endUTC.toLocaleDateString('en-CA');
                        const endTimeLocal = endUTC.toTimeString().slice(0, 5);

                        setTitle(event.title);
                        setVenue(event.venue);
                        setStartDate(startDateLocal);
                        setEndDate(endDateLocal);
                        setStartTime(startTimeLocal);
                        setEndTime(endTimeLocal);
                        setAddress(event.address);
                    }
                });
        }
    }, [id, user]);

    // Handle form submission for updating event
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (startDateTime >= endDateTime) {
            alert("End time must be after start time.");
            return;
        } else {
            const eventData: NewEvent = {
                title,
                venue,
                start: `${startDate}T${startTime}`,
                end: `${endDate}T${endTime}`,
                address
            };
            putEvent(Number(id), eventData, user)
                .then(response => {
                    if (isOk(response.status)) {
                        alert('Event updated successfully!');
                        navigate('/calendar');
                    } else {
                        console.error("Error updating event: ", id);
                        alert('Failed to update event. Please try again.');
                    }
                })
        }
    };

    // Handle event deletion
    const handleDelete = () => {
        if (!user) return;
        deleteEvent(Number(id), user)
            .then(response => {
                if (isOk(response.status)) {
                    alert('Event deleted successfully!');
                    navigate('/calendar');
                } else {
                    alert('Failed to delete event. Please try again.');
                }
            })
    };

    return (
        <div style={{ width: formWidth }}>
            <Container className={styles.container}>
                <Card elevation={6} className={styles.card}>
                    <IconButton
                        onClick={() => navigate('/calendar')} // Navigate back to the calendar
                        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
                        >
                            <Close style={{ fontSize: '40px', color: 'white' }} />
                    </IconButton>
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
        </div>
    );
};

export default EditEvent;
