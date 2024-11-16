import React from 'react';
import { Button, Typography, Paper, Box } from '@mui/material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useBackendUserStore } from '@stores/useBackendUserStore';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { backendUser } = useBackendUserStore();
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
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
        }}
      >
          <Typography variant="h5" gutterBottom>
            Account Information
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>First Name (Preferred):</strong>
            </Typography>
            <Typography variant="body1">
              {backendUser?.first_name || 'Not provided'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>Last Name:</strong>
            </Typography>
            <Typography variant="body1">
              {backendUser?.last_name || 'Not provided'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>Phone Number:</strong>
            </Typography>
            <Typography variant="body1">
              {backendUser?.phone || 'No phone number on account'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>Email:</strong>
            </Typography>
            <Typography variant="body1">
              {backendUser?.email || 'Not provided'}
            </Typography>
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
    </Paper>
  );
}

export default Account;