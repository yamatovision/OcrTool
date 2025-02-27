import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// .envファイルからAPIのURLを読み込むための設定
import.meta.env.VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
