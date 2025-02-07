import React, { useCallback } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const UploadArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.primary.main}`,
  background: 'rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.95)',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    color: theme.palette.primary.main,
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
}));

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onFileSelect(e.dataTransfer.files);
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onFileSelect(e.target.files);
      }
    },
    [onFileSelect]
  );

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <UploadArea
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        elevation={0}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
          <IconWrapper>
            <CloudUploadIcon />
          </IconWrapper>
          <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
            ここにファイルをドロップ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            または クリックしてファイルを選択
          </Typography>
        </label>
      </UploadArea>
    </Box>
  );
};
