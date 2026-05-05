import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
