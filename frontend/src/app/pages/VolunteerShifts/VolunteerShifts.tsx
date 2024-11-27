import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import styles from './VolunteerShifts.module.css';
import { getEventShifts, getVolunteerRoles, NewShift, postEventShifts, Shift, VolunteerRole, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import SnackbarAlert from '@components/SnackbarAlert';
import ShiftCard from '@components/ShiftCard';

const emptyNewShift: NewShift = {
    volunteer_role: 0,
    start: '',
    end: '',
    max_volunteers: 1,
    description: undefined,
}

const VolunteerShifts: React.FC = () => {
    const { id: eventId } = useParams<{ id: string }>();
    const [roles, setRoles] = useState<VolunteerRole[]>([]);
    const [newShift, setNewShift] = useState<NewShift>(emptyNewShift);
    const [shifts, setShifts] = useState<NewShift[]>([]);
    const [savedShifts, setSavedShifts] = useState<Shift[]>([]);
    const { user } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const navigate = useNavigate();

    useEffect(() => {
        if (eventId && user) {
            getVolunteerRoles(user).then(response => setRoles(response.data));
            getEventShifts(Number(eventId), user).then(response => setSavedShifts(response.data));
        }
    }, [eventId, user]);

    const handleAddShift = () => {
        if (!newShift.volunteer_role || !newShift.start || !newShift.end) {
            setSnackbarMessage('Please fill in all shift details.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (new Date(newShift.start) >= new Date(newShift.end)) {
            setSnackbarMessage('Start date and time must be earlier than the end date and time.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setShifts([...shifts, newShift]);
        setNewShift(emptyNewShift);
    };

    const handleSaveShifts = async () => {
        if (!eventId) {
            alert("Event ID or Event Date is missing. Please try again.");
            return;
        }
        if (!user) {
            alert("Not authorized. Wait for sign in to load or try signing in again");
            return;
        }

        const formattedShifts: NewShift[] = shifts.map((shift) => ({
            ...shift,
            event_id: eventId,
            volunteer_role: Number(shift.volunteer_role),
            start: new Date(shift.start).toISOString(), // Convert directly to ISO format
            end: new Date(shift.end).toISOString(),     // Convert directly to ISO format
        }));

        postEventShifts(Number(eventId), formattedShifts, user)
            .then((response) => {
                if (isOk(response.status)) {
                    setSavedShifts(prev => [...prev, ...response.data]);
                    setShifts([]);
                }
            })
    };

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <Paper className={styles.container}>
            <Grid container justifyContent="flex-start">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackClick}
                    style={{ marginBottom: '20px' }}
                >
                    &larr; Back
                </Button>
            </Grid>

            <Typography variant="h4" gutterBottom>
                Create Shifts
            </Typography>

            <Grid 
                container 
                spacing={2} 
                justifyContent="center" 
                alignItems="center"
            >
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={newShift.volunteer_role}
                            onChange={(e) => setNewShift({ ...newShift, volunteer_role: Number(e.target.value) })}
                            displayEmpty
                            renderValue={(selected) => {
                                return selected ? roles.find(role => role.id === selected)?.name : 'Select a Role';
                            }}
                        >
                            <MenuItem value="" disabled>Select a Role</MenuItem>
                            {roles.map(role => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Start Date & Time */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Start Date & Time"
                        type="datetime-local"
                        fullWidth
                        value={newShift.start}
                        onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* End Date & Time */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="End Date & Time"
                        type="datetime-local"
                        fullWidth
                        value={newShift.end}
                        onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Max Volunteers */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Max Volunteers"
                        type="number"
                        fullWidth
                        inputProps={{ min: 1 }}
                        value={newShift.max_volunteers}
                        onChange={(e) => setNewShift({ ...newShift, max_volunteers: parseInt(e.target.value) })}
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
                    <Grid item xs={12} sm={4} key={index}>
                        <ShiftCard 
                            roleName={roles.find(item => item.id === shift.volunteer_role)?.name || ''}
                            start={new Date(shift.start)}
                            end={new Date(shift.end)}
                            maxVolunteers={shift.max_volunteers}
                        />
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
                    <Grid item xs={12} sm={4} key={index}>
                        <ShiftCard 
                            roleName={roles.find(item => item.id === shift.volunteer_role)?.name || ''}
                            start={new Date(shift.start)}
                            end={new Date(shift.end)}
                            maxVolunteers={shift.max_volunteers}
                        />
                    </Grid>
                ))}
            </Grid>
            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </Paper>
    );
};

export default VolunteerShifts;
