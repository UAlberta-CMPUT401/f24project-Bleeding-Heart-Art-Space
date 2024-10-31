import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Button, Card, Container, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './EventDetails.module.css';
import { getVolunteerRoles, Shift, VolunteerRole } from '@utils/fetch';
import { isBefore, isAfter } from 'date-fns';
import { useAuth } from '@lib/context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const [signedUpShifts, setSignedUpShifts] = useState<{ shiftId: number; signupId: number }[]>([]);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);
    const [checkinSignupId, setCheckinSignupId] = useState<number | null>(null);
    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [checkoutSignupId, setCheckoutSignupId] = useState<number | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (id && user) {
            getVolunteerRoles(user).then(response => setRoles(response.data));
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

            axios.get(`${apiUrl}/shift-signups`)
                .then(response => {
                    const userSignups = response.data.filter((signup: any) => signup.user_id === 1);
                    setSignedUpShifts(userSignups.map((signup: any) => ({ shiftId: signup.shift_id, signupId: signup.id })));
                })
                .catch(error => console.error("Error fetching shift signups:", error));
        }
    }, [id, user]);

    const handleEdit = () => {
        navigate(`/edit-event/${id}`);
    };

    const handleGoToShifts = () => {
        navigate(`/volunteer-shifts/${id}`);
    };

    const handleShiftClick = (shift: Shift) => {
        if (signedUpShifts.find(s => s.shiftId === shift.id)) return; // Disable click if already signed up
        setSelectedShift(shift);  // Open confirmation dialog
    };

    const handleConfirmSignup = () => {
        if (!selectedShift) return;

        axios.post(`${apiUrl}/shift-signups`, { user_id: 1, shift_id: selectedShift.id })  // Replace 1 with actual user_id
            .then(response => {
                // Add the new signup to the state with its ID
                setSignedUpShifts(prev => [...prev, { shiftId: selectedShift.id, signupId: response.data.id }]);  
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

    // Function to handle check-in
    const handleCheckIn = (signupId: number) => {
        const checkinTime = new Date().toISOString();

        axios.post(`${apiUrl}/shift-signups/${signupId}/checkin`, { checkin_time: checkinTime })
            .then(() => {
                alert('Checked in successfully!');
                setCheckinDialogOpen(false);
            })
            .catch(error => {
                console.error("Error during check-in:", error);
                alert('Failed to check in. Please try again.');
            });
    };

    // Function to handle check-out
    const handleCheckOut = (signupId: number) => {
        const checkoutTime = new Date().toISOString();

        axios.post(`${apiUrl}/shift-signups/${signupId}/checkout`, { checkout_time: checkoutTime })
            .then(() => {
                alert('Checked out successfully!');
                setCheckoutDialogOpen(false);
            })
            .catch(error => {
                console.error("Error during check-out:", error);
                alert('Failed to check out. Please try again.');
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
                    {shifts.map((shift, index) => {
                        const currentTime = new Date(); // Get current time
                        const shiftStartTime = new Date(shift.start); // Shift start time
                        const shiftEndTime = new Date(shift.end); // Shift end time

                        return (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card 
                                    className={`${styles.shiftCard} ${signedUpShifts.find(s => s.shiftId === shift.id) ? styles.signedUp : ''}`}
                                    onClick={() => handleShiftClick(shift)}
                                >
                                    <Typography variant="h6">
                                        <AssignmentIndIcon /> Role: {roles.find(item => item.id === shift.volunteer_role)?.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        <AccessTimeIcon /> Start: {shiftStartTime.toLocaleTimeString()}
                                    </Typography>
                                    <Typography variant="body1">
                                        <AccessTimeIcon /> End: {shiftEndTime.toLocaleTimeString()}
                                    </Typography>
                                    {signedUpShifts.find(s => s.shiftId === shift.id) && (  // Show green tick if shift is signed up
                                        <>
                                            <Box className={styles.signedupBox}>
                                                <CheckCircleIcon className={styles.signedUpIcon} />
                                                <Typography variant="body2" color="green" style={{ marginLeft: '5px' }}>
                                                    Signed Up!
                                                </Typography>
                                            </Box>
                                            {/* Check In / Check Out Buttons only show if current time is within shift's duration */}
                                            {isAfter(currentTime, shiftStartTime) && isBefore(currentTime, shiftEndTime) && (
                                                <Grid container spacing={1} justifyContent="center" style={{ marginTop: '10px' }}>
                                                    <Grid item>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            onClick={() => {
                                                                setCheckinDialogOpen(true);
                                                                const signup = signedUpShifts.find(s => s.shiftId === shift.id);
                                                                if (signup) setCheckinSignupId(signup.signupId);
                                                            }}
                                                        >
                                                            Check In
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button variant="contained" color="secondary" onClick={() => { setCheckoutSignupId(signedUpShifts.find(s => s.shiftId === shift.id)?.signupId || null); setCheckoutDialogOpen(true); }}>
                                                            Check Out
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Confirmation Dialog for shift signup */}
                <Dialog open={!!selectedShift} onClose={() => setSelectedShift(null)}>
                    <DialogTitle>Confirm Signup</DialogTitle>
                    <DialogContent>
                        Are you sure you want to sign up for this shift?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedShift(null)} color="secondary">Cancel</Button>
                        <Button onClick={handleConfirmSignup} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>

                {/* Check-in Dialog */}
                <Dialog open={checkinDialogOpen} onClose={() => setCheckinDialogOpen(false)}>
                    <DialogTitle>Check In</DialogTitle>
                    <DialogContent>
                        Are you sure you want to check in?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCheckinDialogOpen(false)} color="secondary">Cancel</Button>
                        <Button 
                            onClick={() => {
                                if (checkinSignupId) handleCheckIn(checkinSignupId);
                            }} 
                            color="primary"
                        >
                            Check In
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Check Out Dialog */}
                <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)}>
                    <DialogTitle>Check Out</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to check out?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCheckoutDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => { if (checkoutSignupId) handleCheckOut(checkoutSignupId); }}>
                            Confirm Check Out
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* Edit Event Button */}
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Event
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={handleGoToShifts}>
                            Go to Shifts
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};

export default EventDetails;
