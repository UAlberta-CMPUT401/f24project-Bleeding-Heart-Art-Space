import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, Button, Container } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useAuth } from '@lib/context/AuthContext';
import { getUpcomingEvents, getUserSignups, Event, VolunteerRole, ShiftSignupUser, isOk, getVolunteerRoles } from '@utils/fetch';
import { isBefore, addWeeks } from 'date-fns';
import styles from './Overview.module.css';

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
          <ul>
              {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                      <Card key={event.id} className={styles.card}>
                          <Typography variant="h6">{event.title}</Typography>
                          <Typography variant="body1">
                              <EventIcon /> {new Date(event.start).toLocaleString()}
                          </Typography>
                          <Button 
                              variant="contained" 
                              color="primary" 
                              href={`/events/details/${event.id}`}
                          >
                              View Details
                          </Button>
                      </Card>
                  ))
              ) : (
                  <Typography>No upcoming events in the next two weeks.</Typography>
              )}
          </ul>
        </div>

        <div className = {styles.middleColumn}>

        </div>

        <div className={styles.rightColumn}>
          <h2>Your Signed-up Shifts</h2>
          <ul>
            
              {userSignups.length > 0 ? (
                userSignups.map((signup) => (
                    <Card key={signup.id} className={styles.card}>
                        <Typography variant="h6"> 
                            <AssignmentIndIcon /> Role: {roles.find(item => item.id === Number(signup.volunteer_role))?.name}
                        </Typography>
                        <Typography variant="body1"> <AccessTimeIcon />  {new Date(signup.start).toLocaleString()}
                        </Typography>
                        <Typography variant="body1"> <AccessTimeIcon />  {new Date(signup.end).toLocaleString()}
                        </Typography>
                    </Card>
                ))
            ) : (
                <Typography>You haven't signed up for any shifts yet.</Typography>
            )}
          </ul>
        </div>
      </div>
    );
};

export default OverviewPage;
