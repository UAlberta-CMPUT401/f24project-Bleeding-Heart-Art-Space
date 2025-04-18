import React, { useState, useEffect } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, Typography } from '@mui/material';
import styles from "./CreateEventDialog.module.css";
import { EventNote, LocationOn, Close } from '@mui/icons-material';
import { useEventStore } from '@stores/useEventStore';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { postEventRequest } from '@utils/fetch';
import SnackbarAlert from '@components/SnackbarAlert';

interface CreateEventDialogProps {
    open: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

/**
 * Props for the CreateEventDialog component.
 * 
 * @interface CreateEventDialogProps
 * @property {boolean} open - Indicates whether the dialog is open.
 * @property {() => void} onClose - Function to call when the dialog is closed.
 * @property {string} startDate - The start date of the event.
 * @property {string} endDate - The end date of the event.
 * @property {string} startTime - The start time of the event.
 * @property {string} endTime - The end time of the event.
 */

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ open, onClose, startDate, endDate, startTime, endTime }) => {
    const [title, setTitle] = useState("");
    const [venue, setVenue] = useState("");
    const [address, setAddress] = useState("");
    const [startDateLocal, setStartDateLocal] = useState(startDate);
    const [endDateLocal, setEndDateLocal] = useState(endDate);
    const [startTimeLocal, setStartTimeLocal] = useState(startTime);
    const [endTimeLocal, setEndTimeLocal] = useState(endTime);
    const [loading, setLoading] = useState(false);
    const { addEvent } = useEventStore(); //---> Add event function from EventStore!
    const theme = useTheme();
    const { user } = useAuth();
    const { backendUser } = useBackendUserStore();
    const [validSnackbarOpen, setValidSnackbarOpen] = useState(false);
    const [validSnackbarMessage, setValidSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');


    useEffect(() => {
        setStartDateLocal(startDate);
        setEndDateLocal(endDate);
        setStartTimeLocal(startTime);
        setEndTimeLocal(endTime);
    }, [startDate, endDate, startTime, endTime]);

    const handleClear = () => {
        setTitle("");
        setStartDateLocal("");
        setEndDateLocal("");        
        setStartTimeLocal("");
        setEndTimeLocal("");
        setVenue("");
        setAddress("");
    };

    const dialogClose = () => {
        handleClear();
        onClose();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!backendUser) return;
        const startDateTime = new Date(`${startDateLocal}T${startTimeLocal}`);
        const endDateTime = new Date(`${endDateLocal}T${endTimeLocal}`);

        if (
            !title.trim() || 
            !venue.trim() || 
            !address.trim() || 
            !startDateLocal.trim() || 
            !endDateLocal.trim() || 
            !startTimeLocal.trim() || 
            !endTimeLocal.trim()
        ) {
            setValidSnackbarMessage("All fields are required.");
            setSnackbarSeverity('error');
            setValidSnackbarOpen(true);
            return;
        }

        if (startDateTime >= endDateTime) {
            setValidSnackbarMessage("End time must be after start time.");
            setSnackbarSeverity('error');
            setValidSnackbarOpen(true);
            return;
        }

        const eventData = {
            title,
            venue,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            address
        };

        setLoading(true);
        if (backendUser.is_admin) {
            addEvent(eventData, user);
        } else {
            postEventRequest(eventData, user);
        }
        dialogClose();
        setLoading(false);
    };

    return (
        <Dialog open={open}>
            <DialogTitle className={styles.dialogTitle}>
                <IconButton
                        onClick={dialogClose}
                        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
                    >
                        <Close style={{ fontSize: '40px', color: theme.palette.text.primary }} />
                </IconButton>
                <div>
                    <Typography fontWeight="bold" variant="h4" align="center" gutterBottom>
                        {backendUser?.is_admin ? "Create Event" : "Request Event"}
                    </Typography>
                </div>
            </DialogTitle>
            <DialogContent className={styles.dialogContainer}>
                <div className={styles.dialogCard}>
                    <form onSubmit={handleSubmit} className={styles.dialogForm}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    label="Event Title"
                                    variant="outlined"
                                    fullWidth
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <EventNote style={{ marginRight: '8px' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Venue"
                                    variant="outlined"
                                    fullWidth
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={startDateLocal}
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStartDateLocal(newStartDate);
                                        if (!endDateLocal) {
                                            setEndDateLocal(newStartDate);
                                        }
                                    }}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    variant="outlined"
                                    fullWidth
                                    value={startTimeLocal}
                                    onChange={(e) => setStartTimeLocal(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={endDateLocal}
                                    onChange={(e) => setEndDateLocal(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="End Time"
                                    type="time"
                                    variant="outlined"
                                    fullWidth
                                    value={endTimeLocal}
                                    onChange={(e) => setEndTimeLocal(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <LocationOn style={{ marginRight: '8px' }} />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            color="error"
                            onClick={handleClear}
                            fullWidth
                            style={{ marginTop: '20px' }}
                        >
                            Clear
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            style={{ marginTop: '20px' }}
                            fullWidth 
                            onClick={handleSubmit} 
                            color="secondary" 
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
            <SnackbarAlert
                open={validSnackbarOpen}
                onClose={() => setValidSnackbarOpen(false)}
                message={validSnackbarMessage}
                severity={snackbarSeverity}
            />
        </Dialog>
    );
};

export default CreateEventDialog;
