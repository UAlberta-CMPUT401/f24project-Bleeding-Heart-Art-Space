import React from "react";
import { Button, TextField } from "@mui/material";
import styles from './Login.module.css';

const Login: React.FC = () => {
  return (
    <>
      <h1>Login</h1>
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
    </>
  );
}

export default Login;
