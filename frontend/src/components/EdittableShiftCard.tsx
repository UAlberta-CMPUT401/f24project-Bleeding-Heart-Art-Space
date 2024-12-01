import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import ShiftCard from './ShiftCard'; // Your ShiftCard component
import EditShiftDialog from '@pages/EditShift/EditShiftDialog'; // Import the EditShiftDialog
import { VolunteerRole, Shift, getVolunteerRoles, isOk } from '@utils/fetch'; // Import getVolunteerRoles and the necessary types
import { useAuth } from '@lib/context/AuthContext'; // Import the useAuth hook

// Define the EditableShiftCardProps interface
interface EditableShiftCardProps {
  roleName: string;
  start: string;
  end: string;
  maxVolunteers: number;
  onEdit: (shift: Shift) => void;  // Callback to update the shift in the parent component
  shift: Shift;
}

const EditableShiftCard: React.FC<EditableShiftCardProps> = ({ roleName, start, end, maxVolunteers, onEdit, shift }) => {
  const { user } = useAuth(); // Get the current user from context
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [roles, setRoles] = useState<VolunteerRole[]>([]);

  // Fetch roles when the component mounts or when the user changes
  useEffect(() => {
    if (user) {
      getVolunteerRoles(user).then(response => {
        if (isOk(response.status)) {
          setRoles(response.data);
        }
      });
    }
  }, [user]); // Re-run when the user changes

  // Handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle saving the shift (you can implement this logic as needed)
  const handleSaveShift = (updatedShift: Shift) => {
    console.log('Saved Shift: ', updatedShift);
    // Call the onEdit function passed from the parent to update the shift
    onEdit(updatedShift);
  };

  return (
    <Grid item xs={12} sm={8}>
      <ShiftCard 
        roleName={roleName}
        start={new Date(start)}
        end={new Date(end)}
        maxVolunteers={maxVolunteers}
      />
      <Button onClick={handleOpenDialog} color="primary" style={{ marginTop: '8px' }}>
        Edit
      </Button>

      {/* EditShiftDialog with necessary props */}
      <EditShiftDialog
        open={openDialog}
        shiftId={shift.id}  // Pass the shift ID to the dialog
        eventId={shift.event_id} // Assuming shift has an event_id property
        roles={roles} // Pass the fetched roles here
        onEditSuccess={() => console.log('Shift updated successfully')} // Implement onSuccess callback as needed
        onClose={handleCloseDialog}
        onCancel={handleCloseDialog} // Add the onCancel property
        onSave={handleSaveShift}
      />
    </Grid>
  );
};

export default EditableShiftCard;
