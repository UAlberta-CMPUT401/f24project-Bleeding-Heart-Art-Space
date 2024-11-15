import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

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

export default ConfirmationDialog;
