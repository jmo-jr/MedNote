import React from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AUTH_STORAGE_KEY = 'mednote:isAuthenticated';

interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  firebaseUser: FirebaseUser | null;
  firebaseUserId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    if (isFirebaseConfigured && auth) {
      return false;
    }
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [isAuthLoading, setIsAuthLoading] = React.useState<boolean>(isFirebaseConfigured && !!auth);
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthenticated(Boolean(user));
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (isFirebaseConfigured && auth) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = React.useCallback(async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }
    setIsAuthenticated(true);
  }, []);

  const register = React.useCallback(async (name: string, email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const trimmedName = name.trim();
      if (trimmedName) {
        await updateProfile(credentials.user, { displayName: trimmedName });
      }
      return;
    }
    setIsAuthenticated(true);
  }, []);

  const logout = React.useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
      return;
    }
    setIsAuthenticated(false);
  }, []);

  const value = React.useMemo(
    () => ({
      isAuthenticated,
      isAuthLoading,
      firebaseUser,
      firebaseUserId: firebaseUser?.uid ?? null,
      login,
      register,
      logout,
    }),
    [isAuthenticated, isAuthLoading, firebaseUser, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
