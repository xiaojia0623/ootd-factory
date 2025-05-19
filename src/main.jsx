import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/all.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'swiper/css';
import App from './App.jsx'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
