import React, { useState, useEffect } from 'react';
import { IconButton,  Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useEventStore } from '@stores/useEventStore';
import { NewEvent } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import styles from "./EditEventDialog.module.css";
import { EventNote, LocationOn, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { useNavigate } from 'react-router-dom';
import {ConfirmationDialog} from '@components/ConfirmationDialog';
import SnackbarAlert from '@components/SnackbarAlert';


interface EditEventDialogProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    eventId: number | null;
    onEditSuccess?: () => void;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({ open, onClose, onCancel, eventId, onEditSuccess }) => {
    const { events, updateEvent, deleteEvent } = useEventStore();
    const { user } = useAuth();
    const theme = useTheme();
    const { backendUser } = useBackendUserStore();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // States to handle save changes confirmation dialog
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

    // States to handle delete event confirmation dialog
    const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
    const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState('');
    const [onDeleteConfirmAction, setOnDeleteConfirmAction] = useState<(() => void) | null>(null);

    // States to handle error snackbar
    const [editEventFailSnackbarOpen, setEditEventFailSnackbarOpen] = useState(false);
    const [editEventFailSnackbarMessage, setEditEventFailSnackbarMessage] = useState('');

    const dialogClose = () => {
        setOpenConfirmationDialog(false);
        onClose();
    }
    const deleteDialogClose = () => {
        onClose();
        navigate('/calendar');
    }

    const cancelDialogClose = () => {
        onCancel();
    }

    useEffect(() => {
        if (eventId && open) {
            const event = events.find(event => event.id === eventId);
            if (event) {
                const startUTC = new Date(event.start);
                const endUTC = new Date(event.end);
                setTitle(event.title);
                setVenue(event.venue);
                setAddress(event.address);
                setStartDate(startUTC.toLocaleDateString('en-CA'));
                setStartTime(startUTC.toTimeString().slice(0, 5));
                setEndDate(endUTC.toLocaleDateString('en-CA'));
                setEndTime(endUTC.toTimeString().slice(0, 5));
            }
        }
    }, [eventId, open, events]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !eventId) return;
        if (!backendUser) return;
        if (
            !title.trim() ||
            !venue.trim() ||
            !startDate.trim() ||
            !startTime.trim() ||
            !endDate.trim() ||
            !endTime.trim() ||
            !address.trim()
        ) {
            setEditEventFailSnackbarMessage('All fields are required.');
            setEditEventFailSnackbarOpen(true);
            return;
        }

        const updatedEvent: NewEvent = {
            title,
            venue,
            start: `${startDate}T${startTime}`,
            end: `${endDate}T${endTime}`,
            address,
        };
        setConfirmationMessage('Are you sure you want to save these changes?');
        setOnConfirmAction(() => async () => {
            setLoading(true);
            if (backendUser.is_admin) {
                try {
                    await updateEvent(eventId, updatedEvent, user);
                    if (onEditSuccess) {
                        onEditSuccess();
                    }
                    dialogClose();
                } catch (error) {
                    setOpenConfirmationDialog(false);
                    setEditEventFailSnackbarMessage('End time must be after start time');
                    setEditEventFailSnackbarOpen(true);
                }
            }
            setLoading(false);
        });
        setOpenConfirmationDialog(true);
    };

    const handleDelete = () => {
        setDeleteConfirmationMessage('Are you sure you want to delete this event?');
        setOnDeleteConfirmAction(() => async () => {
            if (!user || !eventId || !backendUser) return;
            if (backendUser.is_admin) {
                await deleteEvent(eventId, user);
            }
            deleteDialogClose();
        });
        setOpenDeleteConfirmationDialog(true);
    };

    return (
        <Dialog open={open}>
            <DialogTitle className={styles.dialogTitle}>
                <IconButton
                    onClick={cancelDialogClose}
                    style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
                >
                    <Close style={{ fontSize: '40px', color: theme.palette.text.primary }} />
                </IconButton>
                <Typography fontWeight="bold" variant="h3" align="center" gutterBottom>
                    Edit Event
                </Typography>
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
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
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
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
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
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
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
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
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
                            onClick={handleDelete}
                            fullWidth
                            style={{ marginTop: '20px' }}
                        >
                            Delete
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>

            <ConfirmationDialog
                open={openConfirmationDialog}
                message={confirmationMessage}
                onConfirm={onConfirmAction ?? (() => {})}
                onCancel={() => setOpenConfirmationDialog(false)}
                title="Confirm Edit"
                confirmButtonText="Save"
            />
            
            <ConfirmationDialog
                open={openDeleteConfirmationDialog}
                message={deleteConfirmationMessage}
                onConfirm={onDeleteConfirmAction ?? (() => {})}
                onCancel={() => setOpenDeleteConfirmationDialog(false)}
                title="Confirm Delete"
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            />
            <SnackbarAlert
            open={editEventFailSnackbarOpen}
            onClose={() => setEditEventFailSnackbarOpen(false)}
            message={editEventFailSnackbarMessage}
            severity="error"
            />
        </Dialog>
    );
};

export default EditEventDialog;
