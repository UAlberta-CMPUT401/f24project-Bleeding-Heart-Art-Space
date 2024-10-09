import React, { useState } from "react";
import { Button, Card, Divider, TextField } from "@mui/material";
import styles from './Login.module.css';
import TopBar from "../../components/layout/topBar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase.ts";

const Signup: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message); 
    }
  };

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
        <form className={styles.loginForm} onSubmit={handleSignUp}>
          
          {error && <div style={{ color: "red" }}>{error}</div>}
          
          <TextField
            required
            type="email"
            variant="outlined"
            label="Email"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            required
            type="password"
            variant="outlined"
            label="Password"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <TextField
            required
            type="password"
            variant="outlined"
            label="Confirm Password"
            color="secondary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Button type="submit" variant="contained">
            Sign-up
          </Button>
        </form>
        
        <Divider sx={{ marginY: '2rem' }}></Divider>
        
        <div>Already have an account?</div>
        
        <Button variant="outlined" href="/login">
          Login
        </Button>
      </Card>
    </TopBar>
  );
};

export default Signup;
