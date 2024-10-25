import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../../utils/firebase'; // Import your Firebase config
import { onAuthStateChanged, User } from 'firebase/auth';

// Define the AuthContext type
interface AuthContextType {
    user: User | null;
    loading: boolean;
  }
  
  // Initialize the context with a default value (can be null initially)
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  // Define the props for AuthProvider
  interface AuthProviderProps {
    children: ReactNode; // ReactNode type ensures the children can be React elements
  }
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Set the type to User | null
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user); // This is fine now since we handle User | null
        setLoading(false);
      });
  
      return () => unsubscribe(); // Cleanup the subscription on unmount
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
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