import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout