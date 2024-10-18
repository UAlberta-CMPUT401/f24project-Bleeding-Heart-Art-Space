import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Card } from '@mui/material';
import axios from 'axios';
import styles from "./CreateEvent.module.css";
import { EventNote, LocationOn } from '@mui/icons-material';
import '@components/layout/TopNav.css';
import '@components/layout/Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';


interface CreateEventProps {
    isSidebarOpen: boolean;
    onAddEvent: (event: { title: string; start: Date; end: Date; venue: string, address: string }) => void;
}

const apiUrl = "http://localhost:3000/api";

const CreateEvent: React.FC<CreateEventProps> = ({ isSidebarOpen, onAddEvent }) => {
    const navigate = useNavigate();
    const location = useLocation();
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
        setFormWidth(isSidebarOpen ? 'calc(100% - 200px)' : '100%'); // Adjust for the sidebar width
    }, [isSidebarOpen]);

    // Sets dates and times apart for selected slot location on calendar
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const startParam = params.get('start');
        const endParam = params.get('end');

        if (startParam) {
            const startDateTime = new Date(startParam);
            setStartDate(startDateTime.toISOString().slice(0, 10));
            setStartTime(startDateTime.toISOString().slice(11, 16));
        }
        if (endParam) {
            const endDateTime = new Date(endParam);
            setEndDate(endDateTime.toISOString().slice(0, 10));
            setEndTime(endDateTime.toISOString().slice(11, 16));
        }
    }, [location.search]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (startDateTime >= endDateTime) {
            alert("End time must be after start time.");
            return;
        }
        else{
            const eventData = {
                title: title, 
                venue: venue,
                start: `${startDate}T${startTime}`,
                end: `${endDate}T${endTime}`,
                address: address
            };
            
            axios.post(`${apiUrl}/events`, eventData)
                .then(response => {
                    console.log("Event created successfully:", response.data);
                    alert('Event created successfully!');
                    onAddEvent({
                        title: eventData.title,
                        start: new Date(eventData.start),
                        end: new Date(eventData.end),
                        venue: eventData.venue,
                        address: eventData.address
                    });
                    navigate('/calendar');
                })
                .catch(error => {
                    console.error("Error creating event:", error.response?.data || error.message);
                    alert('Failed to create event. Please try again.');
                });
            
            // CLEAR/RESTART THE FIELDS AND LOG
            setTitle("");
            setStartDate("");
            setEndDate("");
            setStartTime("");
            setEndTime("");
            setVenue("");
            setAddress("");
            console.log({ title, startDate, endDate, startTime, endTime, venue, address });
        }
    };

    // Handle clear button click
    const handleClear = () => {
        setTitle("");
        setStartDate("");
        setEndDate("");        
        setStartTime("");
        setEndTime("");
        setVenue("");
        setAddress("");
    };

    return (
        <div style={{ width: formWidth }}>
            <Container className={styles.container}>
                <Card elevation={6} className={styles.card}>
                    <Typography fontWeight="bold" variant="h3" align="center" gutterBottom>
                        Create Event
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
                                            onClick={handleClear}
                                            fullWidth
                                            style={{ marginTop: '20px' }}
                                        >
                                            Clear
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
                                            Create
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

export default CreateEvent;
