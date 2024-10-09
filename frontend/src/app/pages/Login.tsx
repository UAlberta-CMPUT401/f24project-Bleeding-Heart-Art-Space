import React from "react";
import { Button, Card, Divider, TextField } from "@mui/material";
import styles from './Login.module.css';
import TopBar from "../../components/layout/topBar";

const Login: React.FC = () => {
  return (
    <TopBar>
      <h1>Login</h1>
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
            type="email"
            className={styles.textField}
            variant="outlined"
            label="Email"
            color="secondary"
          >
          </TextField>
          <TextField
            type="password"
            className={styles.textField}
            variant="outlined"
            label="Password"
            color="secondary"
          >
          </TextField>
          <Button
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </form>
        <Divider
          sx={{
            marginY: '2rem',
          }}
        ></Divider>
        <div>Don't have an account yet?</div>
        <Button
          variant="outlined"
          href="/signup"
        >
          Sign-up
        </Button>
      </Card>
    </TopBar>
  );
}

export default Login;
