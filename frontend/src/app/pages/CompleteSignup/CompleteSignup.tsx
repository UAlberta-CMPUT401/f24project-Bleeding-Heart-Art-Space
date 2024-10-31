import React, { useEffect, useState } from "react";
import { Button, Card, TextField, Alert } from "@mui/material";
import styles from '../Login/Login.module.css';
import { getBackendUser, isOk, NewBackendUser, postBackendUser } from "@utils/fetch";
import { useAuth } from "@lib/context/AuthContext";
import { useNavigate } from "react-router-dom";

const CompleteSignup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getBackendUser(user).then(response => {
        if (isOk(response.status)) {
          navigate('/overview');
        }
      })
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    setError(null);

    setFirstName(prev => prev.trim());
    if (!firstName) {
      setError('Missing First Name');
      return;
    }

    setLastName(prev => prev.trim());
    if (!lastName) {
      setError('Missing Last Name');
      return;
    }

    setPhone(prev => prev.trim());
    if (phone) {
      const phoneRegex = /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (!phoneRegex.test(phone)) {
        setError('Invalid Phone Format');
        return;
      }
    }

    const newBackendUser: NewBackendUser = {
      first_name: firstName,
      last_name: lastName,
      phone: phone ? phone : null,
    }
    const response = await postBackendUser(user, newBackendUser);
    if (response.status === 200) {
      navigate('/overview');
    } else {
      setError(`Failed to created user`);
    }
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
