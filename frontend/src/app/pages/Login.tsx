import React, { useState } from "react";
import { Button, Card, Divider, TextField, Alert } from "@mui/material";
import styles from './Login.module.css';
import TopBar from "../../components/layout/topBar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase.ts";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);

      
      navigate("/overview"); 
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
  };

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
        <form className={styles.loginForm} onSubmit={handleLogin}>
          
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

          <TextField
            type="password"
            className={styles.textField}
            variant="outlined"
            label="Password"
            color="secondary"
            onChange={(e) => setPassword(e.target.value)}
          />

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
        />

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
