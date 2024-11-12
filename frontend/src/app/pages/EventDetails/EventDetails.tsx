import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Card, Container, Dialog, DialogTitle, DialogContent, DialogActions, Box, Snackbar, Alert } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './EventDetails.module.css';
import { getEvent, getVolunteerRoles, Shift, VolunteerRole, Event, isOk, getEventShifts, ShiftSignupUser, getEventShiftSignups, postShiftSignup, NewShiftSignup, checkin, checkout } from '@utils/fetch';
import { isBefore, isAfter } from 'date-fns';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import EditEventDialog from '@pages/EditEvent/EditEventDialog';
import SnackbarAlert from '@components/SnackbarAlert';

const EventDetails: React.FC = () => {
    const { id: eventIdStr } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const [userSignups, setUserSignups] = useState<ShiftSignupUser[]>([]);
    const [eventSignups, setEventSignups] = useState<ShiftSignupUser[]>([]);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);
    const [checkinSignupId, setCheckinSignupId] = useState<number | null>(null);
    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [checkoutSignupId, setCheckoutSignupId] = useState<number | null>(null);
    const { user } = useAuth();
    const { backendUser } = useBackendUserStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    //Snackbar alert states
    const [signupFailSnackbarOpen, setSignupFailSnackbarOpen] = useState(false);
    const [signupFailSnackbarMessage, setSignupFailSnackbarMessage] = useState('');
    const [signupSuccessSnackbarOpen, setSignupSuccessSnackbarOpen] = useState(false);
    const [signupSuccessSnackbarMessage, setSignupSuccessSnackbarMessage] = useState('');
    const [checkinSnackbarOpen, setCheckinSnackbarOpen] = useState(false);
    const [checkinSnackbarMessage, setCheckinSnackbarMessage] = useState('');
    const [checkoutSnackbarOpen, setCheckoutSnackbarOpen] = useState(false);
    const [checkoutSnackbarMessage, setCheckoutSnackbarMessage] = useState('');

    useEffect(() => {
        if (eventIdStr && user) {
            const eventId = Number(eventIdStr);
            getVolunteerRoles(user).then(response => {
                if (isOk(response.status)) {
                    setRoles(response.data)
                }
            });
            getEvent(eventId, user).then(response => {
                if (isOk(response.status)) {
                    setEvent(response.data)
                }
            });
            getEventShifts(eventId, user).then(response => {
                if (isOk(response.status)) {
                    setShifts(response.data)
                }
            });
            getEventShiftSignups(eventId, user).then(response => {
                if (isOk(response.status)) {
                    setEventSignups(response.data)
                    setUserSignups(response.data.filter(signup => signup.uid === user.uid));
                }
            });
        }
    }, [eventIdStr, user]);

    const handleEdit = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        navigate('/calendar');
    };

    const handleEditDialogCancel = () => {
        setEditDialogOpen(false);
    };

    const handleGoToShifts = () => {
        navigate(`/volunteer-shifts/${eventIdStr}`);
    };

    const handleShiftClick = (shift: Shift) => {
        if (userSignups.find(s => s.shift_id === shift.id)) return; // Disable click if already signed up
        setSelectedShift(shift);  // Open confirmation dialog
    };

    const handleConfirmSignup = () => {
        if (!selectedShift) return;
        if (!user) return;
        if (!backendUser) return;

        const newShiftSignup: NewShiftSignup = {
            user_id: backendUser.id,
            shift_id: selectedShift.id,
            checkin_time: null,
            checkout_time: null,
            notes: null,
        }
        postShiftSignup(newShiftSignup, user).then(response => {
            if (isOk(response.status)) {
                setUserSignups(prev => [...prev, response.data]);
                setEventSignups(prev => [...prev, response.data]);
                setSignupSuccessSnackbarMessage('Successfully Signed Up to Shift!');
                setSignupSuccessSnackbarOpen(true);
                setSelectedShift(null);  // Close confirmation dialog
            }
            else {
                if (response.error) {
                    setSignupFailSnackbarMessage(response.error);
                }
                setSignupFailSnackbarOpen(true);
                setSelectedShift(null);  // Close confirmation dialog
            }
        })
    };

    // Function to handle check-in
    const handleCheckIn = (signupId: number) => {
        if (!user) return;
        const checkin_time = new Date().toISOString();

        checkin(signupId, { checkin_time }, user).then(response => {
            if (isOk(response.status)) {
                alert('Checked in successfully!'); //DELETE THIS AFTER ADDING CHECK-IN
                setCheckinSnackbarMessage('Checked in successfully!');
                setCheckinSnackbarOpen(true);
                setCheckinDialogOpen(false);
            }
        })
    };

    // Function to handle check-out
    const handleCheckOut = (signupId: number) => {
        if (!user) return;
        const checkout_time = new Date().toISOString();

        checkout(signupId, { checkout_time }, user).then(response => {
            if (isOk(response.status)) {
                alert('Checked out successfully!'); //DELETE THIS AFTER ADDING CHECK-IN
                setCheckoutSnackbarMessage('Checked out successfully!');
                setCheckoutSnackbarOpen(true);
                setCheckoutDialogOpen(false);
            }
        })
    };

    return (
        <>
            {event && <Container className={styles.container}>
                <Card elevation={6} className={styles.card}>
                    {/* Event Header Section */}
                    <Typography variant="h4" align="center" gutterBottom>
                        {event?.title}
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        {/* Event Details */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" align="center">
                                <AccessTimeIcon /> Start Date/Time: {new Date(event.start).toLocaleString()}
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
                        CLICK ON A SHIFT TO SIGN UP
                    </Typography>
                    <Grid container spacing={2}>
                        {shifts.map((shift, index) => {
                            const currentTime = new Date(); // Get current time
                            const shiftStartTime = new Date(shift.start); // Shift start time
                            const shiftEndTime = new Date(shift.end); // Shift end time

                            return (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Card 
                                        className={`${styles.shiftCard} ${userSignups.find(s => s.shift_id === shift.id) ? styles.signedUp : ''}`}
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
                                        {userSignups.find(s => s.shift_id === shift.id) && (  // Show green tick if shift is signed up
                                            <>
                                                <Box className={styles.signedUpBox}>
                                                    <CheckCircleIcon className={styles.signedUpIcon} />
                                                    <Typography variant="body2" color="green" style={{ marginLeft: '5px' }}>
                                                        Signed up!
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
                                                                    const signup = userSignups.find(s => s.shift_id === shift.id);
                                                                    if (signup) setCheckinSignupId(signup.id);
                                                                }}
                                                            >
                                                                Check In
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button variant="contained" color="secondary" onClick={() => { setCheckoutSignupId(userSignups.find(s => s.shift_id === shift.id)?.id || null); setCheckoutDialogOpen(true); }}>
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

                <SnackbarAlert
                open={signupFailSnackbarOpen}
                onClose={() => setSignupFailSnackbarOpen(false)}
                message={signupFailSnackbarMessage}
                severity="error"
                />
                <SnackbarAlert
                open={signupSuccessSnackbarOpen}
                onClose={() => setSignupSuccessSnackbarOpen(false)}
                message={signupSuccessSnackbarMessage}
                severity="success"
                />

                {/* Snackbar for Check-in Success. CHANGE THIS INTO SNACKBAR COMPONENT */}
                <Snackbar
                    open={checkinSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setCheckinSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setCheckinSnackbarOpen(false)} severity="success" variant="filled">
                        {checkinSnackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Snackbar for Check-out Success. CHANGE THIS INTO SNACKBAR COMPONENT */}
                <Snackbar
                    open={checkoutSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setCheckoutSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setCheckoutSnackbarOpen(false)} severity="success" variant="filled">
                        {checkoutSnackbarMessage}
                    </Alert>
                </Snackbar>
                <EditEventDialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    onCancel={handleEditDialogCancel}
                    eventId={Number(eventIdStr)}
                />
            </Container>}
        </>
    );
};

export default EventDetails;
