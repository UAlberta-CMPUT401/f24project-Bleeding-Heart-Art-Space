import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useBackendUserStore } from '@stores/useBackendUserStore';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { backendUser, setBackendUser } = useBackendUserStore();

  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState(backendUser?.first_name || '');
  const [lastName, setLastName] = useState(backendUser?.last_name || '');
  const [phone, setPhone] = useState(backendUser?.phone || '');
  const [email, setEmail] = useState(backendUser?.email || '');

  useEffect(() => {
    if (backendUser) {
      setFirstName(backendUser.first_name ?? '');
      setLastName(backendUser.last_name ?? '');
      setPhone(backendUser.phone ?? '');
      setEmail(backendUser.email ?? '');
    }
  }, [backendUser]);  

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  const handleEdit = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (backendUser) {
      setBackendUser({
        ...backendUser,
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
      });

      setOpen(false);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        padding: 4,
        maxWidth: 500,
        margin: 'auto',
        mt: 5,
        borderRadius: 2,
        boxShadow: 'none',
        position: 'relative',
      }}
    >

      <IconButton
        onClick={handleEdit}
        sx={{ position: 'absolute', top: 16, right: 16 }}
        aria-label="edit"
      >
        <EditIcon />
      </IconButton>

      <Typography variant="h5" gutterBottom>
        Account Information
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>First Name (Preferred):</strong>
        </Typography>
        <Typography variant="body1">{backendUser?.first_name || 'Not provided'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>Last Name:</strong>
        </Typography>
        <Typography variant="body1">{backendUser?.last_name || 'Not provided'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>Phone Number:</strong>
        </Typography>
        <Typography variant="body1">{backendUser?.phone || 'Not Provided'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>Email:</strong>
        </Typography>
        <Typography variant="body1">{backendUser?.email || 'Not provided'}</Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSignOut}
        fullWidth
        sx={{ mt: 3 }}
      >
        Sign Out
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Account Information</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="First Name (Preferred)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Account;