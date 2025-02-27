import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, AuthResponse, LoginFormData } from '../types';
import { login as apiLogin, getCurrentUser, logout as apiLogout } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<AuthResponse>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if (localStorage.getItem('authToken')) {
          const response = await getCurrentUser();
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: LoginFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiLogin(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setError(response.message || 'ログインに失敗しました');
      }
      
      setIsLoading(false);
      return response;
    } catch (error) {
      setError('エラーが発生しました');
      setIsLoading(false);
      return { success: false, message: 'エラーが発生しました' };
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};