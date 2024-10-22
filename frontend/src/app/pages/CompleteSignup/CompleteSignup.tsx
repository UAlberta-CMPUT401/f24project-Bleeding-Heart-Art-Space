import React, { useState } from "react";
import { Button, Card, TextField, Alert } from "@mui/material";
import styles from '../Login/Login.module.css';

const CompleteSignup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  //TODO: make sure user hasn't already been created by calling get /api/users

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    //TODO: create user on backend with by calling post /api/users
  }

  return (
    <>
      <h1>Complete Sign-up</h1>
      <Card
        sx={{
          marginX: 'auto',
          maxWidth: '30rem',
          padding: '2rem',
        }}
      >
        <form className={styles.loginForm} onSubmit={handleLogin}>

          {error && (
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}

          <TextField
            required
            type="text"
            className={styles.textField}
            variant="outlined"
            label="First Name (Preferred)"
            color="secondary"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            required
            type="text"
            className={styles.textField}
            variant="outlined"
            label="Last Name"
            color="secondary"
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            type="tel"
            className={styles.textField}
            variant="outlined"
            label="Phone (Optional)"
            color="secondary"
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
          >
            Complete
          </Button>
        </form>

      </Card>
    </>
  );
}

export default CompleteSignup;
