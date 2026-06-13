import { NavLink } from 'react-router-dom'
import api from '../api/axios'

const navItems = [
  { to: '/dashboard',  icon: '⊞', label: 'Dashboard'  },
  { to: '/expenses',   icon: '↕', label: 'Expenses'   },
  { to: '/categories', icon: '◈', label: 'Categories' },
  { to: '/budget',     icon: '◎', label: 'Budget'     },
]

function Sidebar() {
  async function handleLogout() {
    try { await api.post('/logout') } catch (err) {}
    localStorage.removeItem('token')
    window.location.href = '/auth'
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden lg:flex relative flex-col h-screen w-56 shrink-0 px-3 py-6 border-r overflow-hidden"
        style={{ background: '#0d1117', borderColor: '#1f2d3d' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#1f2d3d 1px, transparent 1px), linear-gradient(90deg,#1f2d3d 1px, transparent 1px)',
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
          <span className="font-display font-extrabold text-base text-white">FetchBucks</span>
        </div>

        <div className="text-xs uppercase tracking-widest text-[#1f3050] px-2 mb-2 z-10">
          Main menu
        </div>

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
              <span className="w-7 h-7 flex items-center justify-center rounded-md text-sm bg-transparent">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout — no user block */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#2a3d52] hover:text-red-400 z-10 transition-colors"
        >
          <span>→</span> Logout
        </button>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t"
        style={{ background: '#0d1117', borderColor: '#1f2d3d', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-2.5 text-xs transition-all
              ${isActive ? 'text-[#4f9cf9]' : 'text-[#3a5270]'}`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="font-medium text-[11px]">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-xs text-[#3a5270] hover:text-red-400 transition-all"
        >
          <span className="text-lg leading-none">→</span>
          <span className="font-medium text-[11px]">Logout</span>
        </button>
      </nav>
    </>
  )
}

export default Sidebar