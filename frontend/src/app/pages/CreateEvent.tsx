import React, { useState, useEffect } from 'react';
import { Box, TextField, Checkbox, Button, IconButton, FormControlLabel, Grid, Typography, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface CreateEventProps {
    isSidebarOpen: boolean;
}

interface Role {
    id: number;
    name: string;
}

const apiUrl = "http://localhost:3000/api"; // Ensure this matches your backend route

const CreateEvent: React.FC<CreateEventProps> = ({ isSidebarOpen }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set()); // State for selected checkboxes
    const [newRole, setNewRole] = useState<string>('');
    const [formWidth, setFormWidth] = useState('100%');
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
    const [loadingAddRole, setLoadingAddRole] = useState<boolean>(false);

    // Adjust form width based on sidebar state
    useEffect(() => {
        setFormWidth(isSidebarOpen ? 'calc(100% - 0px)' : '100%');
    }, [isSidebarOpen]);

    // Fetch roles from backend
    useEffect(() => {
        axios.get(`${apiUrl}/volunteer_roles`)
            .then(response => {
                setRoles(response.data); // Assume response.data is an array of { id, name }
            })
            .catch(error => {
                console.error("Error fetching roles:", error);
            })
            .finally(() => {
                setLoadingRoles(false);
            });
    }, []);

    // Handle checkbox toggle
    const handleCheckboxChange = (id: number) => {
        setSelectedRoles(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    // Handle adding new role
    const handleAddRole = () => {
        if (newRole.trim() !== '') {
            setLoadingAddRole(true);
            axios.post(`${apiUrl}/volunteer_roles`, { name: newRole })
                .then(response => {
                    setRoles([...roles, { id: response.data.id, name: newRole }]); // Assuming response includes the new role ID
                    setNewRole('');
                })
                .catch(error => {
                    console.error("Error adding role:", error);
                    alert('Failed to add role. Please try again.');
                })
                .finally(() => {
                    setLoadingAddRole(false);
                });
        }
    };

    // Handle deleting a role
    const handleDeleteRole = (id: number) => {
        axios.delete(`${apiUrl}/volunteer_roles/${id}`)
            .then(() => {
                setRoles(roles.filter(role => role.id !== id));
                setSelectedRoles(prevSelected => {
                    const newSelected = new Set(prevSelected);
                    newSelected.delete(id);
                    return newSelected;
                });
            })
            .catch(error => {
                console.error("Error deleting role:", error);
                alert('Failed to delete role. Please try again.');
            });
    };

    // Handle form submission
    const handleSubmit = () => {
        // const selectedRoleNames = roles
        //     .filter(role => selectedRoles.has(role.id)) // Filter only selected roles
        //     .map(role => role.name);

        const eventData = {
            start: "2024-10-10T09:00:00.000Z", // Replace with actual form state
            end: "2024-10-10T17:00:00.000Z", // Replace with actual form state
            address: "123 Main St, Citytown", // Replace with actual form state
            title: "Community gathering", // Replace with actual form state
            venue: "City Park", // Replace with actual form state
             // Send only selected role names in JSON format
        };
        
        axios.post(`${apiUrl}/events`, eventData)
            .then(response => {
                console.log("Event created successfully:", response.data);
                alert('Event created successfully!');
            })
            .catch(error => {
                console.error("Error creating event:", error.response?.data || error.message);
                alert('Failed to create event. Please try again.');
            });
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
                                {loadingRoles ? (
                                    <CircularProgress />
                                ) : (
                                    roles.map((role) => (
                                        <Box key={role.id} sx={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                                            <FormControlLabel
                                                control={<Checkbox checked={selectedRoles.has(role.id)} onChange={() => handleCheckboxChange(role.id)} />}
                                                label={role.name}
                                                sx={{ color: '#000000' }}
                                            />
                                            <IconButton onClick={() => handleDeleteRole(role.id)} aria-label="delete role">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                <TextField
                                    label="New Role"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    sx={{ color: '#000000' }}
                                    disabled={loadingAddRole}
                                />
                                <IconButton onClick={handleAddRole} aria-label="add role" disabled={loadingAddRole}>
                                    {loadingAddRole ? <CircularProgress size={24} /> : <AddCircleOutlineIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CreateEvent;
