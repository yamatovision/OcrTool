import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { LoginFormData } from '../../types';

export const Login = () => {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('メールアドレスとパスワードを入力してください');
      return;
    }

    const response = await login(formData);
    if (!response.success) {
      setFormError(response.message || 'ログインに失敗しました');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 4 },
        background: 'rgba(35, 36, 80, 0.95)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #E233FF 0%, #37B6FF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          ログイン
        </Typography>
        <Typography variant="body1" color="text.secondary">
          アカウント情報を入力してください
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError || error}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="メールアドレス"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="パスワード"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 2,
            p: 1.5,
            backgroundImage: 'linear-gradient(90deg, #E233FF 0%, #FF75B5 51%, #37B6FF 100%)',
            backgroundSize: '200% auto',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundPosition: 'right center',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
        </Button>
      </Box>
    </Paper>
  );
};