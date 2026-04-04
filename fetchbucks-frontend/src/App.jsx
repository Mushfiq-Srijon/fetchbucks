import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={
        <div className="font-display text-white p-8">Dashboard coming soon</div>
      } />
    </Routes>
  )
}

export default App