import React, { useState } from "react";
import { Button, Card, Divider, TextField, Alert} from "@mui/material";
import styles from '@pages/Login/Login.module.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@utils/firebase.ts";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(null);

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      setSuccess(true);

      setTimeout(() => {
        navigate("/Login");
      }, 2000);

    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message); 
    }
  };

  return (
    <>
      <h1>Sign-up</h1>
      <Card
        sx={{
          marginX: 'auto',
          maxWidth: '30rem',
          padding: '2rem',
        }}
      >
        <form className={styles.loginForm} onSubmit={handleSignUp}>

          {error && <Alert severity="error">{error}</Alert>}

          {success && <Alert severity="success">Signup successful! Redirecting to login...</Alert>}
          
          
          <TextField
            required
            type="email"
            variant="outlined"
            label="Email"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
          />
          
          <TextField
            required
            type="password"
            variant="outlined"
            label="Password"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
          />
          
          <TextField
            required
            type="password"
            variant="outlined"
            label="Confirm Password"
            color="secondary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={success}
          />
          
          <Button type="submit" variant="contained">
            Sign-up
          </Button>
        </form>
        
        <Divider sx={{ marginY: '2rem' }}></Divider>
        
        <div>Already have an account?</div>
        
        <Button 
          component={Link}
          variant="outlined" 
          to="/login"
          color="primary"
        >
          Login
        </Button>
      </Card>
    </>
  );
};

export default Signup;
