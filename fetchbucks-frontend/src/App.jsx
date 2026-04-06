import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />

      {/* All app pages live inside AppLayout (sidebar + main) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<h1 className="text-white">Expenses coming soon</h1>} />
        <Route path="/categories" element={<h1 className="text-white">Categories coming soon</h1>} />
        <Route path="/budget" element={<h1 className="text-white">Budget coming soon</h1>} />
      </Route>
    </Routes>
  )
}

export default App