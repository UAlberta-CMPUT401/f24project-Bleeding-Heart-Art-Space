import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Box, Paper } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './EventDetails.module.css';
import { getVolunteerRoles, Shift, VolunteerRole, Event, isOk, getEventShifts, ShiftSignupUser, getEventShiftSignups, postShiftSignup, NewShiftSignup } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import EditEventDialog from '@pages/EditEvent/EditEventDialog';
import SnackbarAlert from '@components/SnackbarAlert';
import { useEventStore } from '@stores/useEventStore';
import { ConfirmationDialogNotes } from '@components/ConfirmationDialog';
import ShiftDetailsDialog from '@pages/ShiftDetails/ShiftDetailsDialog';
import useEventAdmin from '@lib/hooks/useEventAdmin';
import ShiftCard from '@components/ShiftCard';

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
    const [notes, setNotes] = useState('');
    const { events, fetchEvent } = useEventStore();
    const [signupFailSnackbarOpen, setSignupFailSnackbarOpen] = useState(false);
    const [signupFailSnackbarMessage, setSignupFailSnackbarMessage] = useState('');
    const [signupSuccessSnackbarOpen, setSignupSuccessSnackbarOpen] = useState(false);
    const [signupSuccessSnackbarMessage, setSignupSuccessSnackbarMessage] = useState('');
    const [editSuccessSnackbarOpen, setEditSuccessSnackbarOpen] = useState(false);
    const [editSuccessSnackbarMessage, setEditSuccessSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [shiftToSignUp, setShiftToSignUp] = useState<Shift | null>(null);
    const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
    const { isEventAdmin } = useEventAdmin(eventIdStr);

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
        setNotes('');
    };

    const handleEditSuccess = () => {
        setEditSuccessSnackbarMessage('Successfully saved changes to event!');
        setEditSuccessSnackbarOpen(true);
    };
    
    const handleGoToShifts = () => {
        navigate(`/volunteer-shifts/${eventIdStr}`, {
            state: {
                eventStart: event?.start,
                eventEnd: event?.end,
            },
        });
    };

    const handleBackClick = () => {
        navigate(`/calendar`);
    }

    const handleViewDetailsClick = (shift: Shift) => {
        setSelectedShift(shift);
        setShiftDialogOpen(true);
    };


    const handleSignUpClick = (shift: Shift) => {
        setShiftToSignUp(shift);
        setConfirmDialogOpen(true);
    };

    const handleConfirmSignup = () => {
        if (!shiftToSignUp) return;
        if (!user) return;
        if (!backendUser) return;

        console.log('Notes being sent to backend:', notes); // Debugging the value of notes

        const newShiftSignup: NewShiftSignup = {
            user_id: backendUser.id,
            shift_id: shiftToSignUp.id,
            volunteer_role: shiftToSignUp.volunteer_role,
            checkin_time: null,
            checkout_time: null,
            notes: notes.trim(),
        }
        postShiftSignup(newShiftSignup, user).then(response => {
            if (isOk(response.status)) {
                setUserSignups(prev => [...prev, response.data]);
                setEventSignups(prev => [...prev, response.data]);
                setSignupSuccessSnackbarMessage('Successfully Signed Up to Shift!');
                setSignupSuccessSnackbarOpen(true);
                setConfirmDialogOpen(false);  // Close confirmation dialog
                setShiftToSignUp(null);       // Reset shiftToSignUp
                setNotes('');                 // Reset notes
            }
            else {
                if (response.error) {
                    setSignupFailSnackbarMessage(response.error);
                }
                setSignupFailSnackbarOpen(true);
                setConfirmDialogOpen(false);  // Close confirmation dialog
                setShiftToSignUp(null);       // Reset shiftToSignUp
                setNotes('');                 // Reset notes
            }
        })
    };

    return (
        <>
            {event && <Paper className={styles.container}>
                <Grid container justifyContent="flex-start">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBackClick}
                        style={{ marginBottom: '20px' }}
                    >
                        &larr; Back
                    </Button>
                </Grid>
                {/* Event Details Section */}
                <Typography variant="h4" align="center" gutterBottom fontSize="3.5rem">
                    {event?.title}
                </Typography>
                <div className={styles.eventDetails}>
                    <Grid container spacing={2} direction="column" alignItems="center">
                        <Grid item xs={12} className={styles.detailItemFlex}>
                            <AccessTimeIcon className={styles.icon} /> 
                                <span className={styles.detailLabel}>Start:</span> 
                                <span className={styles.detailValue}>
                                    {new Date(event.start).toLocaleString([], 
                                        { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                                    )}
                                </span>
                        </Grid>
                        <Grid item xs={12} className={styles.detailItemFlex}>
                            <AccessTimeIcon className={styles.icon} /> 
                                <span className={styles.detailLabel}>End:</span> 
                                <span className={styles.detailValue}>
                                    {new Date(event.end).toLocaleString([], 
                                        { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                                    )}
                                </span>
                        </Grid>
                        <Grid item xs={12} className={styles.detailItemFlex}>
                            <PlaceIcon className={styles.icon} /> 
                                <span className={styles.detailLabel}>Venue:</span> 
                                <span className={styles.detailValue}>{event.venue}</span>
                        </Grid>
                        <Grid item xs={12} className={styles.detailItemFlex}>
                            <PlaceIcon className={styles.icon} /> 
                                <span className={styles.detailLabel}>Address:</span> 
                                <span className={styles.detailValue}>{event.address}</span>
                        </Grid>
                    </Grid>
                </div>

                {/* Created Shifts Section */}
                <Typography fontWeight="bold" variant="h4" gutterBottom align="center" style={{ marginTop: '30px' }}>
                    Click on a shift to sign up:
                </Typography>
                <Grid container spacing={2}>
                    {shifts.map((shift, index) => {
                        const signedUp: boolean = userSignups.some(s => s.shift_id === shift.id)
                        const shiftStartTime = new Date(shift.start);
                        const shiftEndTime = new Date(shift.end);
                        const volunteersCount = eventSignups.filter(signup => signup.shift_id === shift.id).length;
                        return (
                            <Grid item xs={12} sm={4} key={index}>
                                <ShiftCard
                                    roleName={roles.find(item => item.id === shift.volunteer_role)?.name || ''}
                                    start={shiftStartTime}
                                    end={shiftEndTime}
                                    volunteers={volunteersCount}
                                    maxVolunteers={shift.max_volunteers}
                                    sx={signedUp ? { outline: '2px solid #4caf50' } : undefined}
                                >
                                    <Box
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      my='0.5rem'
                                      gap='1rem'
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSignUpClick(shift)}
                                            disabled={signedUp}
                                        >
                                            {signedUp ? 'Signed Up' : 'Sign Up'}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleViewDetailsClick(shift)}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </ShiftCard>
                            </Grid>
                        );
                    })}
                </Grid>
                <ConfirmationDialogNotes
                    open={confirmDialogOpen}
                    title="Confirm Signup"
                    message="Are you sure you want to sign up for this shift?"
                    onConfirm={handleConfirmSignup}
                    notes= {notes}
                    setNotes={setNotes}
                    onCancel={() => {
                        setConfirmDialogOpen(false);
                        setShiftToSignUp(null);
                        setNotes('');
                    }}
                    confirmButtonText="Confirm"
                    cancelButtonText="Cancel"
                />

                {selectedShift && (
                    <ShiftDetailsDialog
                        open={shiftDialogOpen}
                        onClose={() => setShiftDialogOpen(false)}
                        shift={selectedShift}
                    />
                )}
                {/* Edit Event Button */}
                {isEventAdmin && <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={handleEdit}>
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={handleGoToShifts}>
                            Shifts
                        </Button>
                    </Grid>
                </Grid>}
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
                <SnackbarAlert
                    open={editSuccessSnackbarOpen}
                    onClose={() => setEditSuccessSnackbarOpen(false)}
                    message={editSuccessSnackbarMessage}
                    severity="success"
                    autoHideDuration={3000}
                />

                <EditEventDialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    onCancel={handleEditDialogCancel}
                    eventId={Number(eventIdStr)}
                    onEditSuccess={handleEditSuccess}
                />
            </Paper>}
        </>
    );
};

export default EventDetails;
