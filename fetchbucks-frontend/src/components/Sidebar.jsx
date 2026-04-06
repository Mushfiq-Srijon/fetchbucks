import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const navItems = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/expenses', icon: '↕', label: 'Expenses' },
  { to: '/categories', icon: '◈', label: 'Categories' },
  { to: '/budget', icon: '◎', label: 'Budget' },
]

function Sidebar() {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await api.post('/logout')
    } catch (err) {}
    localStorage.removeItem('token')
    navigate('/auth')
  }

  return (
    <aside
      className="relative flex flex-col h-screen w-56 shrink-0 px-3 py-6 border-r overflow-hidden"
      style={{ background: '#0d1117', borderColor: '#1f2d3d' }}
    >

      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#1f2d3d 1px, transparent 1px), linear-gradient(90deg,#1f2d3d 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute bottom-[5%] left-[-30%] w-50 h-50 rounded-full blur-[60px]"
        style={{ background: 'rgba(79,156,249,.05)' }} />
      <div className="absolute top-[10%] right-[-20%] w-35 h-35 rounded-full blur-[50px]"
        style={{ background: 'rgba(124,58,237,.04)' }} />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2 z-10">
        <div className="w-2 h-2 rounded-full bg-[#4f9cf9] shadow-[0_0_10px_#4f9cf9]" />
        <span className="font-display font-extrabold text-base text-white">
          FetchBucks
        </span>
      </div>

      {/* Section */}
      <div className="text-xs uppercase tracking-widest text-[#1f3050] px-2 mb-2 z-10">
        Main menu
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border
              ${isActive
                ? 'text-white bg-[#131920] border-[#1f2d3d]'
                : 'text-[#3a5270] border-transparent hover:text-[#8899aa]'
              }`
            }
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-md text-sm
              bg-transparent">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="bg-[#0a1118] border border-[#141e2a] rounded-lg p-2 flex items-center gap-2 mb-2 z-10">
        <div className="w-7 h-7 rounded-md bg-linear-to-br from-[#1e3a5f] to-[#2d5a9e] flex items-center justify-center text-xs font-bold text-[#7ab3f0]">
          S
        </div>
        <div>
          <div className="text-sm font-semibold text-[#c8d8e8]">Srijon</div>
          <div className="text-xs text-[#2d4060]">Free plan</div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#2a3d52] hover:text-red-400 z-10"
      >
        <span>→</span>
        Logout
      </button>

    </aside>
  )
}

export default Sidebar