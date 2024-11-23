import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import styles from '@pages/ShiftDetails/ShiftDetailsDialog.module.css';
import { Shift, ShiftSignupUserBasic, getShiftSignups, isOk } from '@utils/fetch';
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
      getShiftSignups(shift.id, user).then((response) => {
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
    { field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 100 },
    { field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 100 },
    { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className={styles.dialogTitle}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <PeopleIcon sx={{ marginRight: '8px' }} />
            <Typography variant="h6">Volunteers Signed Up</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {shiftSignups.length > 0 ? (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              className={styles.grid}
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
          <Typography variant="body1" className={styles.noVolunteersText}>
            No volunteers have signed up for this shift.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDetailsDialog;