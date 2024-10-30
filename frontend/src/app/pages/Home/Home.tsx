import React from "react";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <h1>Bleeding Heart Art Space</h1>
      <h2>Volunteer Management App</h2>
      <Button 
        component={Link}
        variant="contained"
        to="/login"
      >
        Login
      </Button>
    </>
  );
}

export default Home;