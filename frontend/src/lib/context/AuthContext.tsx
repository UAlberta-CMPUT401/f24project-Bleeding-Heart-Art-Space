import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Outlet, useNavigate } from "react-router-dom";
import { getBackendUserAndRole, getUserAdminEvents, isOk } from '@utils/fetch';
import { useBackendUserStore } from '@stores/useBackendUserStore';

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
  const { setBackendUser, setUserAdminEvents } = useBackendUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // redirect if not logged in
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      getBackendUserAndRole(user).then((response) => {
        if (isOk(response.status)) {
          setBackendUser(response.data);
        } else {
          navigate('/complete-signup', { replace: true });
        }
      });
      getUserAdminEvents(user).then((response) => {
        if (isOk(response.status) && response.data.length > 0) {
          setUserAdminEvents(response.data);
        }
      });
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
