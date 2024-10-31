import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, Typography } from '@mui/material';
import styles from "./CreateEventDialog.module.css";
import { EventNote, LocationOn, Close } from '@mui/icons-material';
import { useEventStore } from '@stores/useEventStore';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@lib/context/AuthContext';

interface CreateEventDialogProps {
    open: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

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
        if (!user) {
            return;
        }
        const startDateTime = new Date(`${startDateLocal}T${startTimeLocal}`);
        const endDateTime = new Date(`${endDateLocal}T${endTimeLocal}`);

        if (!title || !venue || !address || !startDateLocal || !endDateLocal || !startTimeLocal || !endTimeLocal) {
            alert("All fields are required.");
            return;
        }

        if (startDateTime >= endDateTime) {
            alert("End time must be after start time.");
            return;
        }

        const eventData = {
            title,
            venue,
            start: `${startDateLocal}T${startTimeLocal}`,
            end: `${endDateLocal}T${endTimeLocal}`,
            address
        };

        setLoading(true);
        addEvent(eventData, user);
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
                    <Typography fontWeight="bold" variant="h3" align="center" gutterBottom>
                        Create Event
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
                                    onChange={(e) => setStartDateLocal(e.target.value)}
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
                            variant="contained"
                            color="secondary"
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
                            color="primary" 
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEventDialog;
