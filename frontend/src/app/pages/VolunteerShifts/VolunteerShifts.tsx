import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Typography, Button, Card, Container, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './VolunteerShifts.module.css';
import { getEventShifts, getVolunteerRoles, NewShift, postEventShifts, Shift, VolunteerRole, getEvent, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { format } from 'date-fns';
import SnackbarAlert from '@components/SnackbarAlert';

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
    const location = useLocation();
    const { eventStart, eventEnd } = location.state || {};    

    useEffect(() => {
        if (eventId && user) {
            getVolunteerRoles(user).then(response => setRoles(response.data));
            getEventShifts(Number(eventId), user).then(response => setSavedShifts(response.data));
        }
    }, [eventId, user]);

    useEffect(() => {
        if (eventStart && eventEnd) {
            const localStartTime = new Date(eventStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const localEndTime = new Date(eventEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
            setNewShift((prev) => ({
                ...prev,
                start: localStartTime,
                end: localEndTime,
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

        // Fetch event details to get the event date
        const event = await getEvent(Number(eventId), user);

        const formattedShifts: NewShift[] = shifts.map((shift) => ({
            ...shift,
            event_id: eventId,
            volunteer_role: Number(shift.volunteer_role),
            start: new Date(`${format(event.data.start, 'yyyy-MM-dd')}T${shift.start}`).toISOString(), // Combine event date with shift start time
            end: new Date(`${format(event.data.start, 'yyyy-MM-dd')}T${shift.end}`).toISOString(),     // Combine event date with shift end time
        }));

        postEventShifts(Number(eventId), formattedShifts, user)
            .then((response) => {
                if (isOk(response.status)) {
                    setSavedShifts(prev => [...prev, ...response.data]);
                    setShifts([]);
                }
            })
    };

    return (
        <Container className={styles.container}>
            <Typography variant="h5" gutterBottom>
                Create Shifts
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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

                <Grid item xs={12} md={4}>
                    <TextField
                        label="Start Time"
                        type="time"
                        fullWidth
                        value={newShift.start}
                        onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="End Time"
                        type="time"
                        fullWidth
                        value={newShift.end}
                        onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Input Max Volunteers */}
                <Grid item xs={12} md={4}>
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
                    <Grid item xs={12} sm={6} key={index}>
                        <Card className={styles.shiftCard}>
                            <Typography variant="h6">
                                <AssignmentIndIcon /> Role: {roles.find(item => item.id === shift.volunteer_role)?.name}
                            </Typography>
                            <Typography variant="body1">
                                <AccessTimeIcon /> Start: {shift.start}
                            </Typography>
                            <Typography variant="body1">
                                <AccessTimeIcon /> End: {shift.end}
                            </Typography>
                            <Typography variant="body1">
                                Max Volunteers: {shift.max_volunteers}
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
                                <AssignmentIndIcon /> Role: {roles.find(item => item.id === shift.volunteer_role)?.name}
                            </Typography>
                            <Typography variant="body1">
                                <AccessTimeIcon /> Start: {new Date(shift.start).toLocaleTimeString()}
                            </Typography>
                            <Typography variant="body1">
                                <AccessTimeIcon /> End: {new Date(shift.end).toLocaleTimeString()}
                            </Typography>
                            <Typography variant="body1">
                                Max Volunteers: {shift.max_volunteers}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </Container>
    );
};

export default VolunteerShifts;
