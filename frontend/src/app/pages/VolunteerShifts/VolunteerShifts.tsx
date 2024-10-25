import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Button, Card, Container, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './VolunteerShifts.module.css';

const apiUrl = import.meta.env.VITE_API_URL;

const VolunteerShifts: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [roles, setRoles] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);
    const [savedShifts, setSavedShifts] = useState<any[]>([]);
    const [newShift, setNewShift] = useState({
        volunteer_role: '',
        start: '',
        end: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`${apiUrl}/volunteer_roles`)
                .then(response => setRoles(response.data))
                .catch(error => {
                    console.error("Error fetching roles:", error);
                });

            fetchSavedShifts();
        }
    }, [id]);

    const fetchSavedShifts = () => {
        axios.get(`${apiUrl}/events/${id}/volunteer_shifts`)
            .then(response => setSavedShifts(response.data))
            .catch(error => {
                console.error("Error fetching saved shifts:", error);
            });
    };

    const handleAddShift = () => {
        if (!newShift.volunteer_role || !newShift.start || !newShift.end) {
            alert('Please fill in all shift details.');
            return;
        }

        setShifts([...shifts, newShift]);
        setNewShift({
            volunteer_role: '',
            start: '',
            end: ''
        });
    };

    const handleSaveShifts = () => {
        axios.post(`${apiUrl}/events/${id}/volunteer_shifts`, { shifts })
            .then(() => {
                alert('Shifts successfully saved!');
                fetchSavedShifts();
            })
            .catch(error => {
                console.error('Error saving shifts:', error);
                alert('Failed to save shifts. Please try again.');
            });
    };

    return (
        <Container className={styles.container}>
            <Card elevation={6} className={styles.card}>
                <Typography variant="h5" gutterBottom>
                    Create Shifts
                </Typography>

                <Grid container spacing={2}>
                    {/* Select Role */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newShift.volunteer_role}
                                onChange={(e) => setNewShift({ ...newShift, volunteer_role: e.target.value })}
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Input Start Time */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Start Time"
                            type="time"
                            fullWidth
                            value={newShift.start}
                            onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                        />
                    </Grid>

                    {/* Input End Time */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="End Time"
                            type="time"
                            fullWidth
                            value={newShift.end}
                            onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                        />
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddShift}
                    style={{ marginTop: '20px' }}
                >
                    Add Shift
                </Button>

                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Created Shifts:
                </Typography>
                <Grid container spacing={2}>
                    {shifts.map((shift, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card className={styles.shiftCard}>
                                <Typography variant="h6">
                                    <AssignmentIndIcon /> Role: {shift.volunteer_role}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> Start: {shift.start}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> End: {shift.end}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveShifts}
                    style={{ marginTop: '20px' }}
                    fullWidth
                >
                    Save Shifts
                </Button>

                <Typography variant="h6" gutterBottom style={{ marginTop: '40px' }}>
                    Saved Shifts:
                </Typography>
                <Grid container spacing={2}>
                    {savedShifts.map((shift, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card className={styles.shiftCard}>
                                <Typography variant="h6">
                                    <AssignmentIndIcon /> Role: {shift.volunteer_role}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> Start: {new Date(shift.start).toLocaleTimeString()}
                                </Typography>
                                <Typography variant="body1">
                                    <AccessTimeIcon /> End: {new Date(shift.end).toLocaleTimeString()}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Card>
        </Container>
    );
};

export default VolunteerShifts;
