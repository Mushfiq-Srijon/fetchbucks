import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'

function taka(amount) {
  return '৳' + Number(amount).toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-BD', {
    month: 'short',
    day: 'numeric',
  })
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function Dashboard() {
  const now = new Date()
  const [selMonth, setSelMonth] = useState(now.getMonth()) // 0-indexed
  const [selYear, setSelYear] = useState(now.getFullYear())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ right: 0, left: 'auto' })

  // Build list of available months from account creation up to current month
  // We'll just show past 24 months + current
  const monthOptions = []
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthOptions.push({ month: d.getMonth(), year: d.getFullYear() })
  }

  useEffect(() => {
    setLoading(true)
    api.get(`/dashboard?month=${selMonth + 1}&year=${selYear}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [selMonth, selYear])

  // Close picker on outside click
  useEffect(() => {
    function handler(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (showPicker && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect()
      const dropdownWidth = 240
      const spaceOnRight = window.innerWidth - rect.right
      
      if (spaceOnRight < dropdownWidth + 16) {
        // Not enough space on right, align to left instead
        setDropdownPosition({ left: 0, right: 'auto' })
      } else {
        // Enough space on right, keep original
        setDropdownPosition({ right: 0, left: 'auto' })
      }
    }
  }, [showPicker])

  const monthLabel = `${MONTHS[selMonth]} ${selYear}`
  const isCurrentMonth = selMonth === now.getMonth() && selYear === now.getFullYear()

  const remaining = data ? data.remaining : 0
  const isOver = remaining < 0

  const cards = data ? [
    {
      label: 'Total Spent',
      value: taka(data.total_spent),
      note: `${MONTHS[selMonth]} expenses`,
      color: '#f97316',
      valueColor: '#f97316',
    },
    {
      label: 'Budget',
      value: taka(data.budget),
      note: `Set for ${MONTHS[selMonth]}`,
      color: '#4f9cf9',
      valueColor: '#4f9cf9',
    },
    {
      label: isOver ? 'Budget Exceeded' : 'Remaining',
      value: taka(Math.abs(remaining)),
      note: isOver ? '⚠ Over budget' : 'Left to spend',
      color: isOver ? '#f43f5e' : '#34d399',
      valueColor: isOver ? '#f43f5e' : '#34d399',
    },
  ] : []

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-5 lg:mb-6">
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight" style={{ color: 'var(--text)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {isCurrentMonth ? "Here's what's happening this month." : `Viewing ${monthLabel}`}
          </p>
        </div>

        {/* Month picker trigger */}
        <div ref={pickerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPicker(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all"
            style={{
              background: showPicker ? '#131920' : 'var(--panel)',
              borderColor: showPicker ? '#4f9cf9' : 'var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            📅 {monthLabel}
            <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
          </button>

          {/* Dropdown */}
          {showPicker && (
            <div style={{
              position: 'absolute', ...dropdownPosition, top: 'calc(100% + 8px)', zIndex: 100,
              background: '#0d1117', border: '1px solid #1a2535', borderRadius: 14,
              padding: 12, width: 240, minWidth: 240,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              maxHeight: 280, overflowY: 'auto',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#2d4060', marginBottom: 10, paddingLeft: 4 }}>
                Select Month
              </div>
              {monthOptions.map(({ month, year }) => {
                const isSelected = month === selMonth && year === selYear
                const isCurrent = month === now.getMonth() && year === now.getFullYear()
                return (
                  <button
                    key={`${year}-${month}`}
                    onClick={() => { setSelMonth(month); setSelYear(year); setShowPicker(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '8px 12px', borderRadius: 9, border: 'none',
                      background: isSelected ? '#131920' : 'transparent',
                      color: isSelected ? '#4f9cf9' : '#8899aa',
                      cursor: 'pointer', fontSize: 14, fontWeight: isSelected ? 600 : 400,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#0a0f16' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span>{MONTHS[month]} {year}</span>
                    {isCurrent && <span style={{ fontSize: 11, color: '#2d4060', fontWeight: 500 }}>current</span>}
                    {isSelected && !isCurrent && <span style={{ fontSize: 11, color: '#4f9cf9' }}>✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {cards.map((card) => (
          <div key={card.label}
            className="relative rounded-xl p-4 border overflow-hidden"
            style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: card.color }} />
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </p>
            <p className="font-display font-bold text-2xl tracking-tight" style={{ color: card.valueColor }}>
              {card.value}
            </p>
            <p className="text-xs mt-1" style={{ color: isOver && card.label !== 'Total Spent' && card.label !== 'Budget' ? '#f43f5e' : 'var(--text-muted)' }}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3">

        {/* Spending by Category */}
        <div className="rounded-xl p-4 border" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Spending by category
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>
              {monthLabel}
            </span>
          </div>

          {data?.by_category?.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No expenses this month.</p>
          )}

          <div className="space-y-3">
            {data?.by_category?.map((cat) => {
              const pct = data.total_spent > 0 ? (cat.amount / data.total_spent) * 100 : 0
              return (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-20 text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {cat.name}
                  </div>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <div className="text-xs w-20 text-right" style={{ color: 'var(--text-muted)' }}>
                    {taka(cat.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="rounded-xl p-4 border" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            Recent expenses
          </div>

          {data?.recent_expenses?.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No expenses yet.</p>
          )}

          <div className="space-y-2">
            {data?.recent_expenses?.map((expense) => (
              <div key={expense.id}
                className="flex items-center gap-2 border-b pb-2 last:border-none"
                style={{ borderColor: 'var(--border)' }}>
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: expense.category?.color ?? '#6366f1', color: '#fff' }}>
                  {expense.category?.name?.[0] ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: 'var(--text)' }}>
                    {expense.title}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {expense.category?.name ?? 'Uncategorized'} · {formatDate(expense.date)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-red-400 shrink-0">
                  -{taka(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard