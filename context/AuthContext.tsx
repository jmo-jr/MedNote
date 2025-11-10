import React from 'react';

const AUTH_STORAGE_KEY = 'mednote:isAuthenticated';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = React.useCallback(() => setIsAuthenticated(true), []);
  const logout = React.useCallback(() => setIsAuthenticated(false), []);

  const value = React.useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout]
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
