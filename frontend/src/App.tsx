import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { FileUpload } from './components/FileUpload';
import { ImageList } from './components/ImageList';
import { ProcessingStatus } from './components/ProcessingStatus';
import { useFileUpload } from './hooks/useFileUpload';
import { uploadFiles } from './services/api';
import { ProcessingStatus as ProcessingStatusType } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E233FF',
    },
    background: {
      default: '#1A1B3A',
      paper: '#232450',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: [
      '"Hiragino Kaku Gothic Pro"',
      '"ヒラギノ角ゴ Pro W3"',
      'メイリオ',
      'Meiryo',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700,
      color: '#FFFFFF',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 700,
          padding: '12px 36px',
          background: 'linear-gradient(90deg, #E233FF 0%, #FF75B5 51%, #37B6FF 100%)',
          backgroundSize: '200% auto',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundPosition: 'right center',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: '#232450',
        },
      },
    },
  },
});

function App() {
  const { uploadedFiles, error, handleFiles, removeFile, reorderFiles } = useFileUpload();
  const [processing, setProcessing] = useState<ProcessingStatusType>({
    isProcessing: false,
    progress: 0,
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setProcessing({
      isProcessing: true,
      progress: 0,
      currentFile: uploadedFiles[0].file.name,
    });

    try {
      const files = uploadedFiles.map(uf => uf.file);
      const results = await uploadFiles(files);

      const text = results.map(r => r.text).join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '文字起こし結果.txt';
      a.click();
      URL.revokeObjectURL(url);

      setProcessing({
        isProcessing: false,
        progress: 100,
      });
    } catch (error) {
      setProcessing({
        isProcessing: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'エラーが発生しました',
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: '#1A1B3A',
          backgroundImage: 'radial-gradient(circle at 50% 0%, #2A2C5C 0%, #1A1B3A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          py: 4,
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              background: 'rgba(35, 36, 80, 0.95)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: 800,
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
                文字起こし太郎くん
              </Typography>
              <Typography variant="body1" color="text.secondary">
                画像から簡単にテキストを抽出できます
              </Typography>
            </Box>
            
            <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
              <FileUpload onFileSelect={handleFiles} />
            </Box>
            
            {error && (
              <Typography color="error" mt={2} textAlign="center">
                {error}
              </Typography>
            )}
            
            {uploadedFiles.length > 0 && (
              <Box sx={{ width: '100%', mt: 3 }}>
                <ImageList
                  files={uploadedFiles}
                  onRemove={removeFile}
                  onReorder={reorderFiles}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={processing.isProcessing}
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    maxWidth: 500,
                    mx: 'auto',
                    display: 'block',
                  }}
                >
                  {processing.isProcessing ? '処理中...' : 'テキストを抽出する'}
                </Button>
              </Box>
            )}
            
            <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
              <ProcessingStatus status={processing} />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
