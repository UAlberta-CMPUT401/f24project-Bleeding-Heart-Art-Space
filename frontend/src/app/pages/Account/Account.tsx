import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useBackendUserStore } from '@stores/useBackendUserStore';
import { Typography } from '@mui/material';
import { getData } from '@utils/fetch';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { backendUser } = useBackendUserStore();
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/');
    })
  }

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
    <>
      {backendUser && <h2>{backendUser.first_name} {backendUser.last_name}</h2>}
      <Typography variant="h6" style={{ margin: '10px' }}>
        {error
          ? `Error: ${error}`
          : totalHours !== null
          ? `Total Hours Worked: ${totalHours} hours`
          : 'Loading...'}
      </Typography>
      <Button
        onClick={handleSignOut}
        variant='outlined'
      >
        Sign Out
      </Button>
    </>
  );
}

export default Account
