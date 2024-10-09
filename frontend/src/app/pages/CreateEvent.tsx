import React, { useState, useEffect } from 'react';
import { Box, TextField, Checkbox, Button, IconButton, FormControlLabel, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

interface CreateEventProps {
    isSidebarOpen: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;

const CreateEvent: React.FC<CreateEventProps> = ({ isSidebarOpen }) => {
    const [roles, setRoles] = useState<string[]>(['Role 1', 'Role 2', 'Role 3']);
    const [newRole, setNewRole] = useState<string>('');
    const [formWidth, setFormWidth] = useState('100%');

    useEffect(() => {
        setFormWidth(isSidebarOpen ? 'calc(100% - 0px)' : '100%');
    }, [isSidebarOpen]);

    useEffect(() => {
        axios.get(`${apiUrl}/volunteer_roles`)
            .then(response => {
                setRoles(response.data.map((role: { name: string }) => role.name));
            })
            .catch(error => {
                console.error("Error fetching roles:", error);
            });
    }, []);

    const handleAddRole = () => {
        if (newRole.trim() !== '') {
            axios.post(`${apiUrl}/volunteer_roles`, { name: newRole })
                .then(response => {
                    setRoles([...roles, newRole]);
                    setNewRole('');
                })
                .catch(error => {
                    console.error("Error adding role:", error);
                });
        }
    };

    return (
        <Box sx={{ width: formWidth, margin: 'auto', padding: '20px' }}>
            <Box sx={{ maxWidth: '1800px', width: '100%', margin: 'auto', padding: '20px', boxShadow: 1, backgroundColor: '#ffffff' }}>
                <Typography variant="h2" sx={{ color: '#000000' }}>Create Event</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} sx={{ color: '#000000' }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} sx={{ color: '#000000' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Venue" sx={{ color: '#000000' }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Number of Artists" type="number" sx={{ color: '#000000' }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Number of Volunteers" type="number" sx={{ color: '#000000' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            <Typography variant="subtitle1" sx={{ color: '#000000' }}>Add roles for volunteers:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {roles.map((role, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox />}
                                        label={role}
                                        sx={{ marginRight: '8px', color: '#000000' }}
                                    />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                <TextField
                                    label="New Role"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    sx={{ color: '#000000' }}
                                />
                                <IconButton onClick={handleAddRole} aria-label="add role">
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CreateEvent;
