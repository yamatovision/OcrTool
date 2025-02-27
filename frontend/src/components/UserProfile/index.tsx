import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRankColor = (rank: string) => {
    switch (rank) {
      case '管理者':
        return '#FFD700'; // ゴールド
      case '皆伝':
        return '#00C2CB'; // ターコイズ
      case '奥伝':
        return '#37B6FF'; // ブルー
      case '中伝':
        return '#8A2BE2'; // ブルーバイオレット
      case '初伝':
        return '#FF75B5'; // ピンク
      case 'お試し':
        return '#00FF7F'; // スプリンググリーン
      case '退会者':
        return '#888888'; // グレー
      default:
        return '#37B6FF';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        background: 'rgba(35, 36, 80, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={user.userRank}
            size="small"
            sx={{
              backgroundColor: getRankColor(user.userRank),
              color: '#232450',
              fontWeight: 'bold',
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            ログアウト
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};