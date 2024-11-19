import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { updateUser, getData } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { backendUser, setBackendUser } = useBackendUserStore();
  const { user } = useAuth();

  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(backendUser?.first_name || '');
  const [lastName, setLastName] = useState(backendUser?.last_name || '');
  const [phone, setPhone] = useState(backendUser?.phone || '');
  const [email, setEmail] = useState(backendUser?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleEdit = () => {
    if (backendUser) {
      setFirstName(backendUser.first_name ?? '');
      setLastName(backendUser.last_name ?? '');
      setPhone(backendUser.phone ?? '');
      setEmail(backendUser.email ?? '');
    }
    setError(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await updateUser(user!, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });

      if (response.status === 200) {
        setBackendUser({
          ...backendUser!,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        });
        setOpen(false);
      } else {
        setError(response.error || 'Failed to update user.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalHoursWorked = async () => {
    try {
      if (!backendUser) return;
      const response = await getData<{ totalHours: number }>(
        `/shift-signups/user/${backendUser.id}/total-hours`
      );
      if (response.error) {
        setError(response.error);
        setTotalHours(null);
      } else {
        setTotalHours(response.data.totalHours);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch total hours worked.');
      setTotalHours(null);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTotalHoursWorked();
  }, [backendUser]);

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 500,
        mx: 'auto',
        mt: 5,
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <IconButton onClick={handleEdit} sx={{ position: 'absolute', top: 16, right: 16 }}>
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
        <Typography variant="body1">{backendUser?.phone || 'Not provided'}</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>Email:</strong>
        </Typography>
        <Typography variant="body1">{backendUser?.email || 'Not provided'}</Typography>
      </Box>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {error
          ? `Error: ${error}`
          : totalHours !== null
          ? `Total Hours Worked: ${totalHours} hours`
          : 'Loading...'}
      </Typography>
      <Button variant="contained" color="primary" fullWidth onClick={handleSignOut}>
        Sign Out
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Account Information</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled // Optional: Disable email editing if not allowed
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Account;