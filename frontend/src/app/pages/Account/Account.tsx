
import React, { useState, useEffect } from 'react';
import {Button,Typography,Paper,Box,IconButton,Dialog,DialogActions,DialogContent,DialogTitle,TextField,Alert,InputAdornment,Snackbar,} from '@mui/material';
import { Edit as EditIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { auth } from '@utils/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { updateUser, getData } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

/**
 * Account component allows users to view and edit their account information,
 * including first name, last name, phone number, and password. It also provides
 * functionality to sign out and resend email verification.
 *
 * @component
 * @example
 * return (
 *   <Account />
 * )
 *
 * @returns {React.FC} A React functional component that renders the account information page.
 *
 * @remarks
 * This component uses various hooks and Material-UI components to manage state and UI.
 * It interacts with Firebase for authentication and user data management.
 *
 * @hook
 * - useNavigate: To navigate between routes.
 * - useBackendUserStore: To access and update backend user data.
 * - useAuth: To access the authenticated user.
 * - useState: To manage local state.
 * - useEffect: To fetch total hours worked and check email verification status on component mount.
 *
 * @function
 * - togglePasswordVisibility: Toggles the visibility of password fields.
 * - handleSignOut: Signs out the user and navigates to the home page.
 * - handleEdit: Opens the dialog for editing account information.
 * - handleClose: Closes the edit dialog.
 * - handleSnackbarClose: Closes the snackbar notification.
 * - handleResendVerification: Resends the email verification to the user.
 * - checkEmailVerificationStatus: Checks if the user's email is verified.
 * - handleSave: Saves the updated account information and password.
 * - fetchTotalHoursWorked: Fetches the total hours worked by the user.
 *
 * @state
 * - totalHours: The total hours worked by the user.
 * - open: Boolean state to control the visibility of the edit dialog.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - phone: The phone number of the user.
 * - email: The email address of the user.
 * - error: Error message to display in case of any error.
 * - totalHoursError: Error message for total hours fetch failure.
 * - isLoading: Boolean state to indicate loading state during save operation.
 * - currentPassword: The current password of the user.
 * - newPassword: The new password to be set.
 * - confirmPassword: The confirmation of the new password.
 * - showCurrentPassword: Boolean state to toggle visibility of current password field.
 * - showNewPassword: Boolean state to toggle visibility of new password field.
 * - showConfirmPassword: Boolean state to toggle visibility of confirm password field.
 * - emailVerified: Boolean state to indicate if the user's email is verified.
 * - isResendDisabled: Boolean state to disable the resend verification button temporarily.
 * - snackbarOpen: Boolean state to control the visibility of the snackbar notification.
 *
 * @dependencies
 * - @mui/material: Material-UI components for UI elements.
 * - @mui/icons-material: Material-UI icons.
 * - @utils/firebase: Firebase utilities for authentication.
 * - @stores/useBackendUserStore: Custom hook to access backend user store.
 * - @utils/fetch: Utility functions for API calls.
 * - @lib/context/AuthContext: Custom hook to access authentication context.
 */
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
  const [totalHoursError, setTotalHoursError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const togglePasswordVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

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
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleResendVerification = async () => {
    if (!user) return;

    try {
      setIsResendDisabled(true);
      await sendEmailVerification(user);
      setSnackbarOpen(true);
    } catch (error: any) {
      setError('Failed to resend verification email. Please try again later.');
      console.error('Error sending verification email:', error);
    } finally {
      setTimeout(() => setIsResendDisabled(false), 30000); 
    }
  };

  const checkEmailVerificationStatus = async () => {
    if (!user) return;

    try {
      await user.reload();
      setEmailVerified(user.emailVerified);
    } catch (error) {
      console.error('Failed to check email verification status:', error);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      setPhone((prev) => prev.trim());
      if (phone) {
        const phoneRegex = /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!phoneRegex.test(phone)) {
          throw new Error('Invalid Phone Format');
        }
      }

      if (!user) {
        throw new Error('User is not authenticated. Please log in again.');
      }

      // Handle Password Update
      if (newPassword || confirmPassword) {
        if (!currentPassword) {
          throw new Error('Current Password is required to change the password.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('New Password and Confirm Password do not match.');
        }
        if (newPassword.length < 6) {
          throw new Error('New Password must be at least 6 characters long.');
        }

        try {
          const credential = EmailAuthProvider.credential(user.email!, currentPassword);
          await reauthenticateWithCredential(user, credential);
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential') {
            setError('Current Password is incorrect. Please try again.');
            return;
          }
          setError('Failed to reauthenticate. Please try again later.');
          return;
        }

        await updatePassword(user, newPassword);
        console.log('Password updated successfully');
        setSnackbarOpen(true);
      }

      // Update User Information
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
        throw new Error(response.error || 'Failed to update user.');
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);
      setError(error.message || 'An unexpected error occurred.');
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
        setTotalHoursError(response.error);
        setTotalHours(null);
      } else {
        setTotalHours(response.data.totalHours);
        setTotalHoursError(null);
      }
    } catch (err) {
      setTotalHoursError('Failed to fetch total hours worked.');
      setTotalHours(null);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTotalHoursWorked();
    checkEmailVerificationStatus();
  }, [backendUser]);

  return (
    <>
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="textSecondary">
            <strong>Total Hours Worked:</strong>
          </Typography>
          {totalHoursError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {totalHoursError}
            </Alert>
          )}
          <Typography variant="body1">
            {totalHours !== null ? `${totalHours} hours` : 'Loading...'}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handleSignOut}>
          Sign Out
        </Button>
        {!emailVerified && (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleResendVerification}
            disabled={isResendDisabled}
            sx={{ mt: 2 }}
          >
            {isResendDisabled ? 'Please wait...' : 'Resend Verification Email'}
          </Button>
        )}
      </Paper>

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
              disabled
            />
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility(setShowNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="secondary" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {isResendDisabled ? 'Verification email sent!' : 'Password changed successfully!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Account;
