import React from 'react';
import { Button } from '@mui/material';
import { auth } from '@utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/');
    })
  }

  return (
    <>
      <h2>First Name</h2>
      <h2>Last Name</h2>
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
