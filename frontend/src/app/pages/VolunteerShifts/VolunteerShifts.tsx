import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import styles from './VolunteerShifts.module.css';
import { getEventShifts, getVolunteerRoles, NewShift, postEventShifts, Shift, VolunteerRole, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import SnackbarAlert from '@components/SnackbarAlert';
import EdittableShiftCard from '@components/EdittableShiftCard';
import { format } from 'date-fns';

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
    const [shifts, setShifts] = useState<NewShift[]>([]); // Holds shifts being added
    const [savedShifts, setSavedShifts] = useState<Shift[]>([]); // Holds saved shifts
    const { user } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const location = useLocation();
    const { eventStart, eventEnd } = location.state || {};    

    const navigate = useNavigate();
    const [editingShift, setEditingShift] = useState<Shift | null>(null); // State to track shift being edited

    useEffect(() => {
        if (eventId && user) {
            getVolunteerRoles(user).then(response => setRoles(response.data));
            getEventShifts(Number(eventId), user).then(response => setSavedShifts(response.data));
        }
    }, [eventId, user]);

    useEffect(() => {
        if (eventStart && eventEnd) {
            const formatDateTimeLocal = (dateString: string): string => {
                const date = new Date(dateString);
                return format(date, "yyyy-MM-dd'T'HH:mm");
            };
            setNewShift((prev) => ({
                ...prev,
                start: formatDateTimeLocal(eventStart),
                end: formatDateTimeLocal(eventEnd),
            }));
        }
    }, [eventStart, eventEnd]);

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
                    setShifts([]); // Clear new shifts after saving
                }
            });
    };

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift); // Set shift for editing
        setNewShift({
            volunteer_role: shift.volunteer_role,
            start: shift.start,
            end: shift.end,
            max_volunteers: shift.max_volunteers,
            description: shift.description,
        });
    };

    const handleUpdateShift = () => {
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

        // Ensure the shift being edited is properly updated
        const updatedShifts = savedShifts.map((shift) => 
            shift.id === editingShift?.id ? { ...shift, ...newShift } : shift
        );

        // Now update the saved shifts state with the updated shift
        setSavedShifts(updatedShifts); // Update saved shifts

        // Clear the form and reset the editing state
        setNewShift(emptyNewShift); // Clear the form
        setEditingShift(null); // Clear the editing state

        setSnackbarMessage('Shift updated successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); // Show success message
    };

    const handleBackClick = () => {
        navigate(-1);
    };

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

            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel shrink>Role</InputLabel>
                        <Select
                            notched
                            value={newShift.volunteer_role}
                            onChange={(e) => setNewShift({ ...newShift, volunteer_role: Number(e.target.value) })}
                            label="Role"
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        type="datetime-local"
                        label="Start Time"
                        value={newShift.start}
                        onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        type="datetime-local"
                        label="End Time"
                        value={newShift.end}
                        onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Button to Add Shift */}
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={editingShift ? handleUpdateShift : handleAddShift}
                        fullWidth
                    >
                        {editingShift ? 'Update Shift' : 'Add Shift'}
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom style={{ marginTop: '40px' }}>
                Shifts to Add:
            </Typography>
            <Grid container spacing={2}>
                {shifts.map((shift, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <EdittableShiftCard
                            shift={{ ...shift, id: index, event_id: Number(eventId) }} // Add id and event_id to match Shift type
                            roleName={roles.find(role => role.id === shift.volunteer_role)?.name || ''}
                            start={shift.start}
                            end={shift.end}
                            maxVolunteers={shift.max_volunteers}
                            onEdit={() => handleEditShift({ ...shift, id: index, event_id: Number(eventId) })}
                        />
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" gutterBottom style={{ marginTop: '40px' }}>
                Saved Shifts:
            </Typography>
            <Grid container spacing={2}>
                {savedShifts.map((shift, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <EdittableShiftCard
                            shift={shift}
                            roleName={roles.find(role => role.id === shift.volunteer_role)?.name || ''}
                            start={shift.start}
                            end={shift.end}
                            maxVolunteers={shift.max_volunteers}
                            onEdit={() => handleEditShift(shift)}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Save Shifts Button */}
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveShifts}
                        fullWidth
                    >
                        Save Shifts
                    </Button>
                </Grid>
            </Grid>

            {/* Snackbar Alert */}
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
};

export default VolunteerShifts;
