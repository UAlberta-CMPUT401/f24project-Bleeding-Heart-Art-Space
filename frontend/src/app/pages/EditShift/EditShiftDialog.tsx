import React, { useState, useEffect } from 'react';
import { IconButton, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useVolunteerShiftStore } from '@stores/useVolunteerShiftStore';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { useAuth } from '@lib/context/AuthContext';
import { Shift, VolunteerRole } from '@utils/fetch'; // Adjust if needed for your type
import SnackbarAlert from '@components/SnackbarAlert';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface EditShiftDialogProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    shiftId: number | null;
    eventId: number;
    roles: VolunteerRole[]; // Add the roles property here
    onSave: (updatedShift: Shift) => void; // Add the onSave prop
    onEditSuccess?: () => void;
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({ open, onClose, onCancel, shiftId, eventId, roles, onSave, onEditSuccess }) => {
    const { shifts, updateShift, deleteShift } = useVolunteerShiftStore();
    const { user } = useAuth();
    const { backendUser } = useBackendUserStore();
    const theme = useTheme();

    // States for the form inputs
    const [volunteerRole, setVolunteerRole] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxvolunteers, setMaxVolunteers] = useState(0);
    const [loading, setLoading] = useState(false);

    // Confirmation dialog states
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

    // States to handle delete event confirmation dialog
    const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
    const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState('');
    const [onDeleteConfirmAction, setOnDeleteConfirmAction] = useState<(() => void) | null>(null);

    // Error handling snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Load shift details when the dialog opens
    useEffect(() => {
        if (shiftId && open) {
            const shift = shifts.find(shift => shift.id === shiftId);
            if (shift) {
                setVolunteerRole(shift.volunteer_role.toString());
                setStartTime(shift.start);
                setEndTime(shift.end);
                setMaxVolunteers(shift.max_volunteers);
            }
        }
    }, [shiftId, open, shifts]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submit triggered');
      if (!user || !shiftId || !backendUser) return;
    
      // Log field values
      console.log('Volunteer Role:', volunteerRole);
      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
    
      // Ensure volunteerRole, startTime, and endTime are properly defined
      const trimmedVolunteerRole = volunteerRole ? volunteerRole.toString().trim() : ''; // Convert to string if it's a number
      const trimmedStartTime = startTime.trim();
      const trimmedEndTime = endTime.trim();
    
      // Validation for required fields
      if (!trimmedVolunteerRole || !trimmedStartTime || !trimmedEndTime) {
        setSnackbarMessage('All fields are required.');
        setSnackbarOpen(true);
        return;
      }
    
      console.log('Fields are valid, proceeding with saving');
    
      const updatedShift: Shift = {
        id: shiftId,
        event_id: eventId,
        volunteer_role: Number(trimmedVolunteerRole),
        start: startTime,
        end: endTime,
        max_volunteers: maxvolunteers,
      };
    
      setConfirmationMessage('Are you sure you want to save these changes?');
      setOnConfirmAction(() => async () => {
        setLoading(true);
        try {
          console.log('Updating shift...');
          await updateShift(shiftId, updatedShift, user);
          if (onSave) {
            onSave(updatedShift);
          }
          if (onEditSuccess) {
            onEditSuccess();
          }
          onClose();
        } catch (error) {
          console.error('Error updating shift:', error);
          setSnackbarMessage('Failed to update shift. Please try again.');
          setSnackbarOpen(true);
        }
        setLoading(false);
      });
      setOpenConfirmationDialog(true);
    };
    
    

    const handleDelete = () => {
      setDeleteConfirmationMessage('Are you sure you want to delete this shift?');
      setOnDeleteConfirmAction(() => async () => {
          if (!user || !shiftId || !backendUser) return;
          try {
              await deleteShift(shiftId, user);
              setSnackbarMessage('Shift deleted successfully.');
              setSnackbarOpen(true);
              onClose();  // Close the dialog after deletion
              if (onEditSuccess) {
                  onEditSuccess();  // Refresh shifts or notify parent component
                  window.location.reload();  // Reload the page to reflect changes
              }
          } catch (error) {
              setSnackbarMessage('Failed to delete shift. Please try again.');
              setSnackbarOpen(true);
          }
      });
      setOpenDeleteConfirmationDialog(true);
  };

    return (
        <Dialog open={open}>
            <DialogTitle>
                <IconButton onClick={onCancel} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                    <Close style={{ fontSize: '40px', color: theme.palette.text.primary }} />
                </IconButton>
                <Typography fontWeight="bold" variant="h3" align="center" gutterBottom>
                    Edit Shift
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Volunteer Role</InputLabel>
                                <Select
                                    value={volunteerRole || ''}
                                    onChange={(e) => setVolunteerRole(e.target.value)}
                                    label="Volunteer Role"
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button color="error" onClick={handleDelete} fullWidth>
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            color="secondary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>

            <ConfirmationDialog
                open={openDeleteConfirmationDialog}
                message={deleteConfirmationMessage}
                onConfirm={onDeleteConfirmAction ?? (() => {})}
                onCancel={() => setOpenDeleteConfirmationDialog(false)}
                title="Confirm Delete"
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            />

            <ConfirmationDialog
                open={openConfirmationDialog}
                message={confirmationMessage}
                onConfirm={onConfirmAction ?? (() => {})}
                onCancel={() => setOpenConfirmationDialog(false)}
                title="Confirm Edit"
                confirmButtonText="Save"
                cancelButtonText="Cancel"
            />

            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity="error"
            />
        </Dialog>
    );
};

export default EditShiftDialog;
