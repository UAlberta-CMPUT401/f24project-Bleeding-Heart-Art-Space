import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, TextField } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  title?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  title = 'Confirm Action',
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">{cancelButtonText}</Button>
        <Button variant='contained' onClick={onConfirm} color="secondary">{confirmButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
};

interface ConfirmationDialogNotesProps extends ConfirmationDialogProps {
  notes: string;
  setNotes: (value: string) => void;
}


const ConfirmationDialogNotes: React.FC<ConfirmationDialogNotesProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  notes,
  setNotes,
}) => {
  return (
      <Dialog open={open} onClose={onCancel}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
              <p>{message}</p>
              <TextField
                  fullWidth
                  label="Add Notes (optional)"
                  value={notes} // Bind to notes state
                  onChange={(e) => setNotes(e.target.value)} // Update state on change
                  multiline
                  rows={3}
                  variant="outlined"
                  inputProps={{
                    'data-gramm': 'false',
                    'data-gramm_editor': 'false',
                  }}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={onCancel} color="secondary">
                  {cancelButtonText}
              </Button>
              <Button onClick={onConfirm} color="primary">
                  {confirmButtonText}
              </Button>
          </DialogActions>
      </Dialog>
  );
};



export { ConfirmationDialog, ConfirmationDialogNotes };
