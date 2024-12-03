
import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Stack, Paper } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '@lib/context/AuthContext';
import { getUpcomingEvents, getUpcomingShifts, Event, VolunteerRole, ShiftSignupUser, isOk, getVolunteerRoles, checkin, checkout, getEventShifts, getEventShiftSignups, Shift } from '@utils/fetch';
import { isBefore, addWeeks } from 'date-fns';
import styles from './Overview.module.css';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import SnackbarAlert from '@components/SnackbarAlert';
import { format } from 'date-fns';
import ShiftCard from '@components/ShiftCard';
import { Link } from 'react-router-dom';

/**
 * OverviewPage component displays the user's signed-up shifts and upcoming events.
 * 
 * @component
 * @example
 * return (
 *   <OverviewPage />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @description
 * This component fetches and displays the user's signed-up shifts and upcoming events for the next two weeks.
 * It allows the user to check in and check out of their shifts and view event details.
 * 
 * @hook
 * useEffect - Fetches volunteer roles, upcoming events, and shifts when the component mounts or the user changes.
 * useEffect - Fetches event shifts and signups when upcoming events or the user changes.
 * useEffect - Updates the current time every second.
 * 
 * @state {Event[]} upcomingEvents - List of upcoming events.
 * @state {ShiftSignupUser[]} userSignups - List of user's signed-up shifts.
 * @state {VolunteerRole[]} roles - List of volunteer roles.
 * @state {boolean} snackbarOpen - State to control the visibility of the snackbar.
 * @state {string} snackbarMessage - Message to be displayed in the snackbar.
 * @state {'success' | 'error' | 'info' | 'warning'} snackbarSeverity - Severity of the snackbar message.
 * @state {Date} currentTime - Current time, updated every second.
 * @state {{ [eventId: number]: Shift[] }} eventShiftsMap - Map of event IDs to their respective shifts.
 * @state {{ [eventId: number]: ShiftSignupUser[] }} eventSignupsMap - Map of event IDs to their respective signups.
 * 
 * @function handleCheckIn - Handles the check-in process for a shift.
 * @param {number} signupId - The ID of the shift signup.
 * 
 * @function handleCheckOut - Handles the check-out process for a shift.
 * @param {number} signupId - The ID of the shift signup.
 * 
 * @requires @mui/material - Material-UI components.
 * @requires @mui/icons-material - Material-UI icons.
 * @requires @lib/context/AuthContext - Authentication context.
 * @requires @utils/fetch - Utility functions for fetching data.
 * @requires date-fns - Date utility functions.
 * @requires @components/SnackbarAlert - SnackbarAlert component.
 * @requires @components/ShiftCard - ShiftCard component.
 * @requires react-router-dom - React Router DOM for navigation.
 */
const OverviewPage: React.FC = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [userSignups, setUserSignups] = useState<ShiftSignupUser[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const { user } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventShiftsMap, setEventShiftsMap] = useState<{ [eventId: number]: Shift[] }>({});
    const [eventSignupsMap, setEventSignupsMap] = useState<{ [eventId: number]: ShiftSignupUser[] }>({});

    useEffect(() => {

        if (!user) return;

        getVolunteerRoles(user).then(response => {
            if (isOk(response.status)) {
                setRoles(response.data)
            }
        });

        const twoWeeksFromNow = addWeeks(new Date(), 2);

        // Fetch events for the next 2 weeks
        getUpcomingEvents(user).then(response => {
            if (isOk(response.status)) {
                setUpcomingEvents(response.data.filter((event: Event) => 
                    isBefore(new Date(event.start), twoWeeksFromNow)
                ));
            }
        });

        // Fetch shifts for the next 2 weeks
        getUpcomingShifts(user).then(response => {
            if (isOk(response.status)) {
                setUserSignups(response.data)
            }
        });

        

    }, [user]);

    useEffect(() => {
        if (upcomingEvents.length > 0 && user) {
            const fetchEventShiftsAndSignups = async () => {
                const shiftsMap: { [eventId: number]: Shift[] } = {};
                const signupsMap: { [eventId: number]: ShiftSignupUser[] } = {};
            
                await Promise.all(
                    upcomingEvents.map(async (event) => {
                    const [shiftsResponse, signupsResponse] = await Promise.all([
                        getEventShifts(event.id, user),
                        getEventShiftSignups(event.id, user),
                    ]);
            
                    shiftsMap[event.id] = isOk(shiftsResponse.status) ? shiftsResponse.data : [];
                    signupsMap[event.id] = isOk(signupsResponse.status) ? signupsResponse.data : [];
                    })
                );
            
                setEventShiftsMap(shiftsMap);
                setEventSignupsMap(signupsMap);
            };
        
            fetchEventShiftsAndSignups();
        }
    }, [upcomingEvents, user]);      

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = async (signupId: number) => {
        if (!user) return;
        
        const checkInTime = new Date().toISOString();
        
        const response = await checkin(signupId, { checkin_time: checkInTime }, user);
        if (isOk(response.status)) {
            setUserSignups(prevSignups =>
            prevSignups.map(signup =>
                signup.id === signupId ? { ...signup, checkin_time: new Date(checkInTime) } : signup
            )
            );
            setSnackbarMessage('Check-in successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage(response.error || 'Check-in failed!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
      
    const handleCheckOut = async (signupId: number) => {
        if (!user) return;
        
        const checkOutTime = new Date().toISOString();
        
        const response = await checkout(signupId, { checkout_time: checkOutTime }, user);
        if (isOk(response.status)) {
            setUserSignups(prevSignups =>
            prevSignups.map(signup =>
                signup.id === signupId ? { ...signup, checkout_time: new Date(checkOutTime) } : signup
            )
            );
            setSnackbarMessage('Check-out successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage(response.error || 'Check-out failed!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
      
    return (
        <div className= {styles.container}>
            <Paper className={styles.leftColumn}>
                <h2>Your Signed-up Shifts</h2>
                {userSignups.length > 0 ? (
                    <Stack spacing={2}>
                        {userSignups.map((signup) => (
                            <ShiftCard
                                roleName={roles.find(item => item.id === Number(signup.volunteer_role))?.name || ''}
                                start={new Date(signup.start)}
                                end={new Date(signup.end)}
                            >
                                {signup.notes && (
                                    <Typography
                                        variant="body2"
                                        className={styles.centeredFlex}
                                        gutterBottom
                                        style={{ fontStyle: 'italic', color: '#6c757d' }}
                                    >
                                        Note: {signup.notes}
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCheckIn(signup.id)}
                                        disabled={
                                            signup.checkin_time != null ||
                                            currentTime < new Date(signup.start) ||
                                            currentTime > new Date(signup.end)
                                        }
                                        startIcon={signup.checkin_time != null ? <CheckIcon /> : null}
                                    >
                                        {signup.checkin_time != null ? 'Checked In' : 'Check In'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCheckOut(signup.id)}
                                        disabled={
                                            signup.checkin_time == null ||
                                            signup.checkout_time != null ||
                                            currentTime < new Date(signup.start) ||
                                            currentTime > new Date(signup.end)
                                        }
                                        startIcon={signup.checkout_time != null ? <CheckIcon /> : null}
                                    >
                                        {signup.checkout_time != null ? 'Checked Out' : 'Check Out'}
                                    </Button>
                                </Stack>
                                <Button 
                                    variant="contained"
                                    component={Link}
                                    to={`/events/details/${signup.event_id}`}
                                    sx={{ m: '0.5rem' }}
                                >
                                    View Event
                                </Button>
                            </ShiftCard>
                        ))}
                    </Stack>
                ) : (
                    <Typography>No upcoming signed up shifts in the next two weeks.</Typography>
                )}
            </Paper>


            <Paper className={styles.rightColumn}>
                <h2>Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <Stack spacing={2}>
                    {upcomingEvents.map((event) => {
                        const eventShifts = eventShiftsMap[event.id] || [];
                        const eventSignups = eventSignupsMap[event.id] || [];

                        const totalMaxVolunteers = eventShifts.reduce((sum, shift) => sum + shift.max_volunteers, 0);
                        const totalVolunteersSignedUp = eventSignups.length;

                        return (
                        <Card elevation={15} key={event.id} className={styles.card}>
                            <Typography variant="h6" className={styles.centeredFlex}>{event.title}</Typography>
                            <Typography variant="body1" className={styles.centeredFlex} gutterBottom>
                                <EventIcon className={styles.iconSpacing} />{' '}
                                {format(new Date(event.start), 'MMM d, yyyy, hh:mm a')}
                            </Typography>
                            <Typography variant="body1" className={styles.centeredFlex} gutterBottom>
                                <PeopleIcon className={styles.iconSpacing} />{' '}
                                Total Volunteers: {totalVolunteersSignedUp}/{totalMaxVolunteers}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/events/details/${event.id}`}
                                >
                                    View Details
                            </Button>
                        </Card>
                        );
                    })}
                    </Stack>
                ) : (
                    <Typography>No upcoming events in the next two weeks.</Typography>
                )}
            </Paper>
            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </div>
    );
};

export default OverviewPage;
