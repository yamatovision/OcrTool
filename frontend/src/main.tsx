import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// .envファイルからAPIのURLを読み込むための設定
// 環境変数はビルド時に埋め込まれるため、実行時に変更はできません

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
