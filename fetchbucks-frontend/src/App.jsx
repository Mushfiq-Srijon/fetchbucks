import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Categories from './pages/Categories'
import Budget from './pages/Budget'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const token = localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/auth'} />} />
      <Route path="/auth" element={token ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/budget" element={<Budget />} />
      </Route>
    </Routes>
  )
}

export default App