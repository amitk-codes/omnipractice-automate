import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import ClientPage from './pages/clientPage'
import AppointmentPage from './pages/AppointmentPage'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/" element={<Navigate to="/clients" replace />} />
      </Routes>
    </Router>
  )
}

export default App 