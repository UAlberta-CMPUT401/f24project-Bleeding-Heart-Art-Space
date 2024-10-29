import React, { useState } from "react";
import styles from '../Login/Login.module.css';
import { Button, Card, Divider, TextField, Alert } from "@mui/material";
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email.trim().length === 0) {
      setError("Enter email");
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent");
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <Card
        sx={{
          marginX: 'auto',
          maxWidth: '30rem',
          padding: '2rem',
        }}
      >
        <form className={styles.loginForm} onSubmit={handlePasswordReset}>

          {error && (
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}

          <TextField
            type="email"
            className={styles.textField}
            variant="outlined"
            label="Email"
            color="secondary"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
          >
            Send Email
          </Button>

          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}

        </form>

        <Divider
          sx={{
            marginY: '2rem',
          }}
        />

        <Button
          component={Link}
          variant="outlined"
          to="/login"
        >
          Login
        </Button>

      </Card>
    </>
  );
}

export default ResetPassword;
