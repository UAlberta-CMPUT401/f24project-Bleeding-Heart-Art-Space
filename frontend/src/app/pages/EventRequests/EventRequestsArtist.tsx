import React, { useState, useEffect } from 'react';
import { Container, Grid2, Typography, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './EventRequests.module.css';
import { deleteEventRequest as deleteEventRequestCall, EventRequestUser, getUserEventRequests } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import EventRequestCard from './EventRequestCard';

const EventRequestsArtist: React.FC = () => {
    const [eventRequests, setEventRequests] = useState<EventRequestUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            getUserEventRequests(user)
                .then(response => {
                    setEventRequests(response.data);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    const deleteEventRequest = (id: number) => {
        if (!user) return;
        deleteEventRequestCall(id, user)
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
                            {(eventReq.status === 2) &&
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    style={{ marginTop: '10px' }}
                                    onClick={() => deleteEventRequest(eventReq.id)}
                                >
                                    Delete Request
                                </Button>
                            }

                        </EventRequestCard>
                    ))}
                </Grid2>
            :
                <Paper
                    sx={{ 
                        width:'20rem', 
                        height:'12rem', 
                        display:'flex', 
                        flexDirection:'column',
                        gap:'1rem',
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
                    <Typography variant='body1'>
                        Go to calendar to create an event request
                    </Typography>
                </Paper>
            }
        </Container>
    );
};

export default EventRequestsArtist;
