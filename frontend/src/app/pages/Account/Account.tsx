import React from 'react';
import { Button } from '@mui/material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useBackendUserStore } from '@stores/useBackendUserStore';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { backendUser } = useBackendUserStore();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/');
    })
  }

  return (
    <>
      {backendUser && <h2>{backendUser.first_name} {backendUser.last_name}</h2>}
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
