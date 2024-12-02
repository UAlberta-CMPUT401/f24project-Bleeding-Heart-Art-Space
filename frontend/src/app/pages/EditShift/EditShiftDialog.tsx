import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useVolunteerShiftStore } from '@stores/useVolunteerShiftStore';
import { VolunteerRole, NewShift, Shift, isOk, updateShift, deleteShift } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import SnackbarAlert from '@components/SnackbarAlert';
import { useTheme } from '@mui/material/styles';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { format } from 'date-fns';

interface EditShiftDialogProps {
  open: boolean;
  onClose: () => void;
  shift: Shift | null;
  roles: VolunteerRole[];
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({
  open,
  onClose,
  shift,
  roles,
  onEditSuccess,
  onDeleteSuccess,
}) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { updateShift: updateShiftInStore, deleteShift: deleteShiftInStore } = useVolunteerShiftStore();

  const [volunteerRole, setVolunteerRole] = useState<number | ''>('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [maxVolunteers, setMaxVolunteers] = useState<number>(1);
  const [description, setDescription] = useState<string | undefined>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (shift) {
      setVolunteerRole(shift.volunteer_role);
      setStart(format(new Date(shift.start), "yyyy-MM-dd'T'HH:mm"));
      setEnd(format(new Date(shift.end), "yyyy-MM-dd'T'HH:mm"));
      setMaxVolunteers(shift.max_volunteers);
      setDescription(shift.description);
    }
  }, [shift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shift) return;

    if (!volunteerRole || !start || !end) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (new Date(start) >= new Date(end)) {
      setSnackbarMessage('Start time must be before end time.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const updatedShift: NewShift = {
      volunteer_role: Number(volunteerRole),
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      max_volunteers: maxVolunteers,
      description: description?.trim(),
    };

    setLoading(true);

    const response = await updateShift(shift.id, updatedShift, user);

    if (isOk(response.status)) {
      updateShiftInStore(shift.id, { ...shift, ...updatedShift }, user);
      if (onEditSuccess) onEditSuccess();
        onClose();
    } else {
      setSnackbarMessage('Failed to update shift. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    setLoading(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!user || !shift) return;
  
    setLoading(true);
  
    const response = await deleteShift(shift.id, user);
  
    if (isOk(response.status)) {
      deleteShiftInStore(shift.id, user);
      setDeleteDialogOpen(false);
      if (onDeleteSuccess) onDeleteSuccess();
        onClose();
    } else {
      setSnackbarMessage('Failed to delete shift. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  
    setLoading(false);
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Edit Shift
        <IconButton
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <Close style={{ fontSize: '24px', color: theme.palette.text.primary }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} style={{ marginTop: '8px' }}>
            {/* Volunteer Role */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={volunteerRole}
                  onChange={(e) => setVolunteerRole(Number(e.target.value))}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date & Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                fullWidth
                value={start}
                onChange={(e) => setStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* End Date & Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Max Volunteers */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Volunteers"
                type="number"
                fullWidth
                value={maxVolunteers}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
            color="error"
            onClick={handleDelete}
            disabled={loading}
            >
            Delete
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="secondary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
      <SnackbarAlert
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
        <ConfirmationDialog
            open={deleteDialogOpen}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            title="Confirm Delete"
            message="Are you sure you want to delete this shift? This action cannot be undone."
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
        />
    </Dialog>
    
  );
};

export default EditShiftDialog;
