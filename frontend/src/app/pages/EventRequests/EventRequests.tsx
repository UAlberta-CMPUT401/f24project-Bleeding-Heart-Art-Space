import React from 'react';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import EventRequestsAdmin from './EventRequestsAdmin';
import EventRequestsArtist from './EventRequestsArtist';
import { Typography } from '@mui/material';

const EventRequests: React.FC = () => {
    const { backendUser } = useBackendUserStore();

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Event Requests
            </Typography>

            {backendUser?.is_admin ?
                <EventRequestsAdmin />
                :
                <EventRequestsArtist />
            }
        </>
    );
};

export default EventRequests;
