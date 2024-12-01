import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import styles from '@pages/ShiftDetails/ShiftDetailsDialog.module.css';
import { Shift, ShiftSignupUserBasic, deleteSignups, getShiftSignups, isOk } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { useParams } from 'react-router-dom';
import useEventAdmin from '@lib/hooks/useEventAdmin';

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
  const [selectedSignups, setSelectedSignups] = useState<ShiftSignupUserBasic[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
  const { id: eventIdStr } = useParams<{ id: string }>();
  const { isEventAdmin } = useEventAdmin(eventIdStr);

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
  const columns: GridColDef[] = isEventAdmin ? [
    { field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 100 },
    { field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 100 },
    { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
    { 
      field: 'checkin_time',
      headerName: 'Check In',
      flex: 1,
      minWidth: 200,
      valueFormatter: (value?: string) => {
        if (!value) return '';
        return (new Date(value)).toLocaleString([], {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    },
    { 
      field: 'checkout_time',
      headerName: 'Check Out',
      flex: 1,
      minWidth: 200,
      valueFormatter: (value?: string) => {
        if (!value) return '';
        return (new Date(value)).toLocaleString([], {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    },
    { field: 'notes', headerName: 'Notes', flex: 2, minWidth: 200 },
  ] : [
    { field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 100 },
    { field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 100 },
  ];


  const handleSignupSelect = (ids: GridRowSelectionModel) => {
    const selectedIDs = new Set(ids);
    setSelectedSignups(shiftSignups.filter((signup) => selectedIDs.has(signup.id)));
  };

  const removeSignups = () => {
    if (!user) return;
    deleteSignups(selectedSignups.map(signup => signup.id), user)
      .then(response => {
        if (isOk(response.status)) {
          setShiftSignups(shiftSignups.filter(signup => !response.data.includes(signup.id)));
        }
      });
    setConfirmRemove(false);
    setSelectedSignups([]);
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}   
      maxWidth={false}
      PaperProps={{
        style: { width: 'auto', maxWidth: '90vw' },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <PeopleIcon sx={{ marginRight: '8px' }} />
            <Typography variant="h6">Volunteers Signed Up</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {shiftSignups.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              onRowSelectionModelChange={handleSignupSelect}
              checkboxSelection={isEventAdmin ? true : false}
            />
            {(selectedSignups.length > 0) && 
              <Button
                color="primary"
                variant="contained"
                onClick={() => setConfirmRemove(true)}
              >
                Remove Selected Signups
              </Button>
            }
          </div>
        ) : (
          <Typography variant="body1" className={styles.noVolunteersText}>
            No volunteers have signed up for this shift.
          </Typography>
        )}
      </DialogContent>
      <ConfirmationDialog
          open={confirmRemove}
          message={`Are you sure you want to remove ${selectedSignups.length} selected signups(s)`}
          onConfirm={removeSignups}
          onCancel={() => setConfirmRemove(false)}
          title='Confirm Delete'
      />
    </Dialog>
  );
};

export default ShiftDetailsDialog;
