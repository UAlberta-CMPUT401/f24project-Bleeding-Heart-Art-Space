import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Shift,
  ShiftSignupUserBasic,
  getShiftSignups,
  isOk,
} from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

interface ShiftDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  shift: Shift | null;
}

const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({
  open,
  onClose,
  shift,
}) => {
  const [shiftSignups, setShiftSignups] = useState<ShiftSignupUserBasic[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (shift && user) {
      getShiftSignups(shift.id, user).then(response => {
        if (isOk(response.status)) {
          setShiftSignups(response.data);
        } else {
          console.error('Error fetching shift signups:', response.error);
        }
      });
    }
  }, [shift, user]);

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Volunteers Signed Up</DialogTitle>
      <DialogContent>
        {shiftSignups.length > 0 ? (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={shiftSignups}
              columns={columns}
              initialState={{ 
                  pagination: { 
                  paginationModel: {
                      page: 0,
                      pageSize: 5,
                  },
                  },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
            />

          </div>
        ) : (
          <Typography variant="body1">No volunteers have signed up for this shift.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDetailsDialog;