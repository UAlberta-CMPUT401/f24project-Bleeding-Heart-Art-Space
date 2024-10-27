import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Button, Card, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './EventDetails.module.css';
import { getVolunteerRoles, Shift, VolunteerRole } from '@utils/fetch';

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const [signedUpShifts, setSignedUpShifts] = useState<number[]>([]);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null); 

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
        
            // Fetch all shift signups and filter for current user
            axios.get(`${apiUrl}/shift-signups`)
            .then(response => {
                const userSignups = response.data.filter((signup: any) => signup.user_id === 1);
                setSignedUpShifts(userSignups.map((signup: any) => signup.shift_id));
            })
            .catch(error => console.error("Error fetching shift signups:", error));
        }
    }, [id]);

    const handleEdit = () => {
        navigate(`/edit-event/${id}`);
    };

    const handleGoToShifts = () => {
        navigate(`/volunteer-shifts/${id}`);
    };

    const handleShiftClick = (shift: Shift) => {
        if (signedUpShifts.includes(shift.id)) return; // Disable click if already signed up
        setSelectedShift(shift);  // Open confirmation dialog
    };

    // const handleConfirmSignup = () => {
    //     if (!selectedShift) return;

    //     axios.post(`${apiUrl}/shift-signups`, { user_id: 1, shift_id: selectedShift.id })  // Replace 1 with actual user_id when backend logic is implemented
    //         .then(() => {
    //             setSignedUpShifts(prev => [...prev, selectedShift.id]);  // Update signed-up shifts
    //             setSelectedShift(null);  // Close confirmation dialog
    //         })
    //         .catch(error => {
    //             console.error("Error signing up for shift:", error);
    //             alert('Failed to sign up for the shift. Please try again.');
    //         });
    // };

    const handleConfirmSignup = () => {
        if (!selectedShift) return;
    
        axios.post(`${apiUrl}/shift-signups`, { user_id: 1, shift_id: selectedShift.id })  // Replace 1 with actual user_id
            .then(() => {
                setSignedUpShifts(prev => [...prev, selectedShift.id]);  // Update signed-up shifts
                setSelectedShift(null);  // Close confirmation dialog
            })
            .catch(error => {
                // Check if the error response contains a specific conflict message
                if (error.response && error.response.data && error.response.data.message === "This shift conflicts with another shift you have already signed up for.") {
                    alert("This shift conflicts with another shift you have already signed up for.");
                } else {
                    alert('Failed to sign up for the shift. Please try again.');
                }
                console.error("Error signing up for shift:", error);
            });
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
                            <Card 
                                className={`${styles.shiftCard} ${signedUpShifts.includes(shift.id) ? styles.signedUp : ''}`}
                                onClick={() => handleShiftClick(shift)}
                            >
                                <Typography variant="h6">
                                    <AssignmentIndIcon /> Role: {roles.find(item => item.id === shift.volunteer_role)?.name}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> Start: {new Date(shift.start).toLocaleTimeString()}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> End: {new Date(shift.end).toLocaleTimeString()}
                                </Typography>
                                {signedUpShifts.includes(shift.id) && (  // Show green tick if shift is signed up
                                    <CheckCircleIcon className={styles.signedUpIcon} />
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Confirmation Dialog for shift signup */}
                <Dialog open={!!selectedShift} onClose={() => setSelectedShift(null)}>
                    <DialogTitle>Confirm Signup</DialogTitle>
                    <DialogContent>
                        Are you sure you want to sign up for this shift?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedShift(null)} color="secondary">Cancel</Button>
                        <Button onClick={handleConfirmSignup} color="primary">Yes, Sign Up</Button>
                    </DialogActions>
                </Dialog>

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
