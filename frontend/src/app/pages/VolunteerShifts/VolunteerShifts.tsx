import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import styles from './VolunteerShifts.module.css';
import { getEventShifts, getVolunteerRoles, NewShift, postEventShifts, Shift, VolunteerRole, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import SnackbarAlert from '@components/SnackbarAlert';
import ShiftCard from '@components/ShiftCard';
import { format } from 'date-fns';
import EditShiftDialog from '@pages/EditShift/EditShiftDialog';

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
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const navigate = useNavigate();

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

    const handleDeleteSuccess = () => {
        if (eventId && user) {
          getEventShifts(Number(eventId), user).then((response) => {
            if (isOk(response.status)) {
              setSavedShifts(response.data);
            }
          });
        }
    };
      
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
            start: new Date(shift.start).toISOString(),
            end: new Date(shift.end).toISOString(),
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

    const handleEditClick = (shift: Shift) => {
        setSelectedShift(shift);
        setEditDialogOpen(true);
    };
    
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedShift(null);
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

            <Grid 
                container 
                spacing={2} 
                justifyContent="center" 
                alignItems="center"
            >
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel shrink>Role</InputLabel>
                        <Select
                            notched
                            label="Role"
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
                        >
                            <Button   onClick={() => handleEditClick(shift)} variant="contained" color="secondary" style={{ marginTop: '8px' }}>
                                Edit
                            </Button>
                        </ShiftCard>
                    </Grid>
                ))}
            </Grid>
            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
            <EditShiftDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                shift={selectedShift}
                roles={roles}
                onEditSuccess={() => {
                    if (eventId && user) {
                    getEventShifts(Number(eventId), user).then((response) => {
                        if (isOk(response.status)) {
                        setSavedShifts(response.data);
                        }
                    });
                    }
                }}
                onDeleteSuccess={handleDeleteSuccess}
            />


        </Paper>
    );
};

export default VolunteerShifts;
