import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Categories from './pages/Categories'
import Budget from './pages/Budget'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />

      {/* ProtectedRoute wraps the ENTIRE layout — one check covers all pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/budget" element={<Budget />} />
      </Route>
    </Routes>
  )
}

export default App