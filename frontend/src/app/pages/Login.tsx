import React from "react";
import { Button, Container, Divider, TextField } from "@mui/material";
import styles from './Login.module.css';
import TopBar from "../../components/layout/topBar";

const Login: React.FC = () => {
  return (
    <TopBar>
      <h1>Login</h1>
      <Container
        maxWidth="sm"
        sx={(theme) => ({
          borderRadius: '1rem',
          padding: '2rem',
          backgroundColor: theme.palette.background.base1,
          boxShadow: theme.shadows[1],
        })}
      >
        <form
          className={styles.loginForm}
        >
          <TextField
            type="email"
            className={styles.textField}
            variant="outlined"
            label="Email"
          >
          </TextField>
          <TextField
            type="password"
            className={styles.textField}
            variant="outlined"
            label="Password"
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
      </Container>
    </TopBar>
  );
}

export default Login;
