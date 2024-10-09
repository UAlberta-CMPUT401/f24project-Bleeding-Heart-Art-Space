import React from "react";
import { Button, Card, Divider, TextField } from "@mui/material";
import styles from './Login.module.css';
import TopBar from "../../components/layout/topBar";

const Signup: React.FC = () => {
  return (
    <TopBar>
      <h1>Sign-up</h1>
      <Card
        sx={{
          marginX: 'auto',
          maxWidth: '30rem',
          padding: '2rem',
        }}
      >
        <form
          className={styles.loginForm}
        >
          <TextField
            required
            type="email"
            variant="outlined"
            label="Email"
            color="secondary"
          >
          </TextField>
          <TextField
            required
            type="password"
            variant="outlined"
            label="Password"
            color="secondary"
          >
          </TextField>
          <TextField
            required
            type="password"
            variant="outlined"
            label="Confirm Password"
            color="secondary"
          >
          </TextField>
          <Button
            type="submit"
            variant="contained"
          >
            Sign-up
          </Button>
        </form>
        <Divider
          sx={{
            marginY: '2rem',
          }}
        ></Divider>
        <div>Already have an account?</div>
        <Button
          variant="outlined"
          href="/login"
        >
          Login
        </Button>
      </Card>
    </TopBar>
  );
}

export default Signup;
