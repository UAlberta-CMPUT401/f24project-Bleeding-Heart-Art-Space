import React, { useEffect, useState } from "react";
import { Button, Card, Divider, TextField, Alert } from "@mui/material";
import styles from './Login.module.css';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "@utils/firebase.ts";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { blue } from "@mui/material/colors";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        if (result) {
          navigate("/overview");
        }
      }).catch((error) => {
        setError(error);
      });
  }

  useEffect(() => {
    // go to dashboard if already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/overview");
      }
    });

    return () => unsubscribe();
  }, []);

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
    <>
      <h1>Login</h1>
      <Card
        sx={{
          marginX: 'auto',
          maxWidth: '30rem',
          padding: '2rem',
        }}
      >
        <Button 
          variant="contained" 
          onClick={handleGoogleLogin}
          sx={{
            width: '100%',
            backgroundColor: blue[500],
            '&:hover': {
              backgroundColor: blue[700],
            },
          }}
        >
          <GoogleIcon sx={{ mr: 1 }} />
          Sign in with Google
        </Button>

        <Divider sx={{ marginY: '2rem' }}>Or</Divider>

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

        <Button
          component={Link}
          variant="contained"
          color="inherit"
          to="/reset-password"
          sx={{
            marginTop: '1rem',
          }}
        >
          Reset Password
        </Button>

        <Divider
          sx={{
            marginY: '2rem',
          }}
        />

        <div>Don't have an account yet?</div>

        <Button
          component={Link}
          variant="contained"
          color="inherit"
          to="/signup"
        >
          Sign-up
        </Button>

      </Card>
    </>
  );
}

export default Login;
