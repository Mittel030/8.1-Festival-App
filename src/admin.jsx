import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import AdminPage from './pages/AdminPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>,
)
