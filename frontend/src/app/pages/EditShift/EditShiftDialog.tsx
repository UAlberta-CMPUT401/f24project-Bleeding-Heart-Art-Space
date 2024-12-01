import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { useAuth } from '@lib/context/AuthContext';
import { postEventShifts, NewShift, Shift } from '@utils/fetch';
import { useVolunteerRoleStore } from '@stores/useVolunteerRoleStore'; // Adjust the path as needed

interface EditShiftDialogProps {
  eventId: number;
  open: boolean;
  shift: Shift | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({ eventId, open, shift, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { volunteerRoles, fetchVolunteerRoles } = useVolunteerRoleStore();
  const [newShift, setNewShift] = useState<NewShift>({
    volunteer_role: 0,
    start: '',
    end: '',
    max_volunteers: 1,
    description: '',
  });

  useEffect(() => {
    if (open && user) {
      fetchVolunteerRoles(user); // Fetch volunteer roles when dialog opens
      if (shift) {
        setNewShift({
          volunteer_role: shift.volunteer_role,
          start: shift.start,
          end: shift.end,
          max_volunteers: shift.max_volunteers,
          description: shift.description || '',
        });
      } else {
        setNewShift({
          volunteer_role: 0,
          start: '',
          end: '',
          max_volunteers: 1,
          description: '',
        });
      }
    }
  }, [open, shift, user, fetchVolunteerRoles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShift((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setNewShift((prev) => ({ ...prev, volunteer_role: e.target.value as number }));
  };

  const handleSaveShift = async () => {
    if (user) {
      const response = await postEventShifts(eventId, [newShift], user);
      if (response.status === 200) {
        onSuccess();
        onClose();
      } else {
        console.error('Error saving shift:', response.error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{shift ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
      <DialogContent>
        <Select
          value={newShift.volunteer_role}
          onChange={handleRoleChange}
          fullWidth
        >
          {volunteerRoles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Start Time"
          name="start"
          type="datetime-local"
          value={newShift.start}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="End Time"
          name="end"
          type="datetime-local"
          value={newShift.end}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Max Volunteers"
          name="max_volunteers"
          type="number"
          value={newShift.max_volunteers}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={newShift.description || ''}
          onChange={handleInputChange}
          fullWidth
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveShift} color="primary">
          {shift ? 'Update Shift' : 'Create Shift'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditShiftDialog;
