import React from "react";
import { Button } from "@mui/material";
import TopBar from "../../components/layout/topBar";

const Home: React.FC = () => {
  return (

    <TopBar>
      <h1>Bleeding Heart Art Space</h1>
      <h2>Volunteer Management App</h2>
      <Button 
        variant="contained"
        href="/login"
      >
        Login
      </Button>
    </TopBar>

  );
}

export default Home;
