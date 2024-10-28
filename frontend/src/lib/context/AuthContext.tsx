import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Outlet, useNavigate } from "react-router-dom";

// Define the AuthContext type
interface AuthContextType {
    user: User | null;
    loading: boolean;
  }
  
// Initialize the context with a default value (can be null initially)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Outlet/>
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};