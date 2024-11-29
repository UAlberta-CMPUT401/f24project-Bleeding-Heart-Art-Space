import React, { useState, useEffect } from 'react';
import { Container, Grid2, Typography, Button, Paper } from '@mui/material';
import styles from './EventRequests.module.css';
import { getEventRequests, denyEventRequest as denyEventRequestCall, confirmEventRequest as confirmEventRequestCall, EventRequestUser } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import EventRequestCard from './EventRequestCard';

const EventRequestsAdmin: React.FC = () => {
    const [eventRequests, setEventRequests] = useState<EventRequestUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            getEventRequests(user)
                .then(response => {
                    setEventRequests(response.data);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    const denyEventRequest = (id: number) => {
        if (!user) return;
        denyEventRequestCall(id, user)
            .then(() => {
                // remove event request from frontend
                setEventRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            });
    };

    const confirmEventRequest = (id: number) => {
        if (!user) return;
        confirmEventRequestCall(id, user)
            .then(() => {
                // remove event request from frontend
                setEventRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            });
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container className={styles.container}>
            {eventRequests.length > 0 ? 
                <Grid2 container gap='1rem' sx={{ mt:'1rem' }}>
                    {eventRequests.sort((a, b) => b.id - a.id).map((eventReq) => (
                        <EventRequestCard
                            status={eventReq.status}
                            eventName={eventReq.title}
                            requesterName={`${eventReq.first_name} ${eventReq.last_name}`}
                            requesterEmail={eventReq.email}
                            start={eventReq.start}
                            end={eventReq.end}
                            venue={eventReq.venue}
                            address={eventReq.address}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginTop: '10px' }}
                                onClick={() => confirmEventRequest(eventReq.id)}
                            >
                                Approve Request
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => denyEventRequest(eventReq.id)}
                            >
                                Deny Request
                            </Button>
                        </EventRequestCard>
                    ))}
                </Grid2>
            :
                <Paper 
                    sx={{ 
                        width:'20rem', 
                        height:'12rem', 
                        display:'flex', 
                        justifyContent:'center', 
                        alignItems:'center', 
                        p:'2rem',
                        mx:'auto',
                        mt:'2rem',
                    }}
                >
                    <Typography variant='h5'>
                        No Event Requests
                    </Typography>
                </Paper>
            }
        </Container>
    );
};

export default EventRequestsAdmin;
