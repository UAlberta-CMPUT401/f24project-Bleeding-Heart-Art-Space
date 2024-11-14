import React, { useState, useEffect } from 'react';
import { Typography, Card, Button } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useAuth } from '@lib/context/AuthContext';
import { getUpcomingEvents, getUserSignups, Event, VolunteerRole, ShiftSignupUser, isOk, getVolunteerRoles } from '@utils/fetch';
import { isBefore, addWeeks } from 'date-fns';
import styles from './Overview.module.css';
import { Stack } from '@mui/material';

const OverviewPage: React.FC = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [userSignups, setUserSignups] = useState<ShiftSignupUser[]>([]);
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const { user } = useAuth();

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

    return (
        <div className= {styles.container}>
            <div className={styles.leftColumn}>
                <h2>Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <Stack spacing={2}>
                        {upcomingEvents.map((event) => (
                            <Card key={event.id} className={styles.card}>
                                <Typography variant="h6" className={styles.centeredFlex}>{event.title}</Typography>
                                <Typography variant="body1" className={styles.centeredFlex}>
                                    <EventIcon className={styles.iconSpacing}/> {new Date(event.start).toLocaleString()}
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
                                    <AssignmentIndIcon className={styles.iconSpacing}/> Role: {roles.find(item => item.id === Number(signup.volunteer_role))?.name}
                                </Typography>
                                <Typography variant="body1" className={styles.centeredFlex}>
                                    <AccessTimeIcon className={styles.iconSpacing}/> {new Date(signup.start).toLocaleString()}
                                </Typography>
                                <Typography variant="body1" className={styles.centeredFlex}>
                                    <AccessTimeIcon className={styles.iconSpacing}/> {new Date(signup.end).toLocaleString()}
                                </Typography>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Typography>You haven't signed up for any shifts yet.</Typography>
                )}
            </div>
        </div>
    );
};

export default OverviewPage;
