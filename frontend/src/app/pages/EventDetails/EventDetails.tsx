import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Card, Container, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './EventDetails.module.css';
import { getVolunteerRoles, Shift, VolunteerRole, Event, isOk, getEventShifts, ShiftSignupUser, getEventShiftSignups, postShiftSignup, NewShiftSignup } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import EditEventDialog from '@pages/EditEvent/EditEventDialog';
import SnackbarAlert from '@components/SnackbarAlert';
import { useEventStore } from '@stores/useEventStore';

const EventDetails: React.FC = () => {
    const { id: eventIdStr } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const [userSignups, setUserSignups] = useState<ShiftSignupUser[]>([]);
    const [eventSignups, setEventSignups] = useState<ShiftSignupUser[]>([]);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const { user } = useAuth();
    const { backendUser } = useBackendUserStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { events, fetchEvent } = useEventStore();
    const [signupFailSnackbarOpen, setSignupFailSnackbarOpen] = useState(false);
    const [signupFailSnackbarMessage, setSignupFailSnackbarMessage] = useState('');
    const [signupSuccessSnackbarOpen, setSignupSuccessSnackbarOpen] = useState(false);
    const [signupSuccessSnackbarMessage, setSignupSuccessSnackbarMessage] = useState('');

    useEffect(() => {
        const eventId = Number(eventIdStr);
        setEvent(events.find(event => event.id === eventId));
    }, [eventIdStr, events]);

    useEffect(() => {
        if (eventIdStr && user) {
            const eventId = Number(eventIdStr);
            getVolunteerRoles(user).then(response => {
                if (isOk(response.status)) {
                    setRoles(response.data)
                }
            });
            fetchEvent(eventId, user);
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

        console.log('Selected shift:', selectedShift);

        const newShiftSignup: NewShiftSignup = {
            user_id: backendUser.id,
            shift_id: selectedShift.id,
            volunteer_role: selectedShift.volunteer_role,
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
