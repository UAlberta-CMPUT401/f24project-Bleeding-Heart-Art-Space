import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useAuth } from '@lib/context/AuthContext';
import { getUpcomingEvents, getUserSignups, Event, VolunteerRole, ShiftSignupUser, isOk, getVolunteerRoles, checkin, checkout,} from '@utils/fetch';
import { isBefore, addWeeks } from 'date-fns';
import styles from './Overview.module.css';
import CheckIcon from '@mui/icons-material/Check';
import SnackbarAlert from '@components/SnackbarAlert';
import { format } from 'date-fns';

const OverviewPage: React.FC = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [userSignups, setUserSignups] = useState<ShiftSignupUser[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const { user } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [currentTime, setCurrentTime] = useState(new Date());

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

        // Fetch shifts the user has signed up for
        getUserSignups(user).then(response => {
            if (isOk(response.status)) {
                setUserSignups(response.data)
            }
        });
    }, [user]);

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
            <div className={styles.leftColumn}>
                <h2>Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <Stack spacing={2}>
                        {upcomingEvents.map((event) => (
                            <Card key={event.id} className={styles.card}>
                                <Typography variant="h6" className={styles.centeredFlex} >{event.title}</Typography>
                                <Typography variant="body1" className={styles.centeredFlex} gutterBottom>
                                    <EventIcon className={styles.iconSpacing}/> {format(new Date(event.start), 'MM/dd/yyyy, hh:mm a')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href={`/events/details/${event.id}`}
                                >
                                    View Details
                                </Button>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Typography>No upcoming events in the next two weeks.</Typography>
                )}
            </div>

            <div className = {styles.middleColumn}></div>

            <div className={styles.rightColumn}>
                <h2>Your Signed-up Shifts</h2>
                {userSignups.length > 0 ? (
                    <Stack spacing={2}>
                        {userSignups.map((signup) => (
                            <Card key={signup.id} className={styles.card}>
                                <Typography variant="h6" className={styles.centeredFlex}>
                                    <EventIcon className={styles.iconSpacing} /> Event: {signup.event_title}
                                </Typography>
                                <Typography variant="h6" className={styles.centeredFlex}>
                                    <AssignmentIndIcon className={styles.iconSpacing}/> Role: {roles.find(item => item.id === Number(signup.volunteer_role))?.name}
                                </Typography>
                                <Typography variant="body1" className={styles.centeredFlex} gutterBottom>
                                    <AccessTimeIcon className={styles.iconSpacing}/> {format(new Date(signup.start), 'MM/dd/yyyy, hh:mm a')}
                                </Typography>
                                <Typography variant="body1" className={styles.centeredFlex}>
                                    <AccessTimeIcon className={styles.iconSpacing}/> {format(new Date(signup.end), 'MM/dd/yyyy, hh:mm a')}
                                </Typography>
                                <Stack direction="row" spacing={2} justifyContent="center" marginTop={2}>
                                    <Button
                                    variant="contained"
                                    color="primary"
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
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Typography>You haven't signed up for any shifts yet.</Typography>
                )}
            </div>
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
