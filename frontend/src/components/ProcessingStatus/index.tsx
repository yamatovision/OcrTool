import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProcessingStatus as ProcessingStatusType } from '../../types';

const StatusContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-root`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  },
}));

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  if (!status.isProcessing && !status.error) return null;

  return (
    <StatusContainer elevation={0}>
      {status.error ? (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
          }}
        >
          {status.error}
        </Alert>
      ) : (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              処理中...
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {status.progress}%
            </Typography>
          </Box>
          <StyledLinearProgress
            variant="determinate"
            value={status.progress}
          />
          {status.currentFile && (
            <Typography
              variant="caption"
              display="block"
              mt={1.5}
              color="text.secondary"
              textAlign="center"
            >
              処理中のファイル: {status.currentFile}
            </Typography>
          )}
        </Box>
      )}
    </StatusContainer>
  );
};
