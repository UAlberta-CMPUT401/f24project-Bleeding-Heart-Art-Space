import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Button, Card, Container, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './VolunteerShifts.module.css';
import { getEventShifts, getVolunteerRoles, NewShift, postEventShifts, Shift, VolunteerRole, getEvent } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

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

    useEffect(() => {
        if (eventId && user) {
            getVolunteerRoles(user).then(response => setRoles(response.data));
            getEventShifts(Number(eventId), user).then(response => setSavedShifts(response.data));
        }
    }, [eventId, user]);

    const handleAddShift = () => {
        if (!newShift.volunteer_role || !newShift.start || !newShift.end) {
            alert('Please fill in all shift details.');
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
        const eventDetails = await getEvent(Number(eventId), user);

        if (!eventDetails.data.start) {
            throw new Error("Event start date is missing");
        }

        const eventDate = eventDetails.data.start.split('T')[0]; // Use event start date as YYYY-MM-DD

        const formattedShifts: NewShift[] = shifts.map((shift) => ({
            ...shift,
            event_id: eventId,
            volunteer_role: Number(shift.volunteer_role),
            start: `${eventDate}T${shift.start}`, // Combine event date with shift start time
            end: `${eventDate}T${shift.end}`,     // Combine event date with shift end time
        }));

        postEventShifts(Number(eventId), formattedShifts, user)
            .then((response) => {
                setSavedShifts(prev => [...prev, ...response.data]);
                setShifts([]);
            })
            .catch(() => {
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
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            label="End Time"
                            type="time"
                            fullWidth
                            value={newShift.end}
                            onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
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
            </Card>
        </Container>
    );
};

export default VolunteerShifts;
