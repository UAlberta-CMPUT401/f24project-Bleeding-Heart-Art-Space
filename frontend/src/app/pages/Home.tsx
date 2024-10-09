import React from "react";
import { Button } from "@mui/material";

const Home: React.FC = () => {
  return (
    <>
      <h1>Bleeding Heart Art Space</h1>
      <h2>Volunteer Management App</h2>
      <Button 
        variant="contained"
        href="/login"
        style={{
          color: 'inherit',
        }}
      >
        Login
      </Button>
    </>
  );
}

export default Home;
