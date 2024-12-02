import React, { useState } from "react";
import { Button, Card, Divider, TextField, Alert, IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from '@pages/Login/Login.module.css';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@utils/firebase.ts";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      if (auth.currentUser) {
        try {
          await sendEmailVerification(auth.currentUser);
          setVerificationSent(true);
        } catch (verificationError) {
          console.error("Error sending verification email:", verificationError);
          setError("Failed to send verification email. Please try again later.");
        }
      }
      
      setSuccess(true);

      setTimeout(() => {
        navigate("/Login");
      }, 2000);

    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message); 
    } finally {
      setIsProcessing(false);
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

          {success && (
            <Alert severity="success">
              Signup successful! {verificationSent && "A verification email has been sent. Please check your inbox."} Redirecting to login...
            </Alert>
          )}
          
          
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
            type={showPassword ? "text" : "password"} // Toggle between text and password
            variant="outlined"
            label="Password"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
            variant="outlined"
            label="Confirm Password"
            color="secondary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button type="submit" variant="contained" disabled={isProcessing || success}>
            {isProcessing ? "Processing..." : "Sign-up"}
          </Button>
        </form>
        
        <Divider sx={{ marginY: '2rem' }}></Divider>
        
        <div>Already have an account?</div>
        
        <Button 
          component={Link}
          variant="contained" 
          to="/login"
          color="inherit"
        >
          Login
        </Button>
      </Card>
    </>
  );
};

export default Signup;
