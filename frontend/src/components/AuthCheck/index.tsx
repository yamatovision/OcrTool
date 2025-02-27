import { ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Login } from '../Login';

interface AuthCheckProps {
  children: ReactNode;
}

export const AuthCheck = ({ children }: AuthCheckProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress
          sx={{
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography variant="body1" color="text.secondary">
          認証情報を確認中...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#1A1B3A',
          backgroundImage: 'radial-gradient(circle at 50% 0%, #2A2C5C 0%, #1A1B3A 100%)',
        }}
      >
        <Login />
      </Box>
    );
  }

  return <>{children}</>;
};