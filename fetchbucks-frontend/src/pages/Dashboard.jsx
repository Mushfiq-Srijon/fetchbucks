import { useEffect, useState } from 'react'
import api from '../api/axios'

// Helper — formats a number as ৳1,234.00
function taka(amount) {
  return '৳' + Number(amount).toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Helper — formats a date string like "2026-04-20" → "Apr 20"
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-BD', {
    month: 'short',
    day:   'numeric',
  })
}

function Dashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Current month label e.g. "April 2026"
  const monthLabel = new Date().toLocaleDateString('en-BD', {
    month: 'long',
    year:  'numeric',
  })

  const cards = data ? [
    { label: 'Total Spent',  value: taka(data.total_spent), note: 'This month',       color: '#4f9cf9' },
    { label: 'Budget',       value: taka(data.budget),      note: 'Set for this month', color: '#a78bfa' },
    { label: 'Remaining',    value: taka(data.remaining),   note: 'Left to spend',    color: '#34d399' },
  ] : []

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight"
            style={{ color: 'var(--text)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Here's what's happening this month.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          📅 {monthLabel}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {cards.map((card) => (
          <div key={card.label}
            className="relative rounded-xl p-4 border overflow-hidden"
            style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>

            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: card.color }} />

            <p className="text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </p>
            <p className="font-display font-bold text-2xl tracking-tight"
              style={{ color: 'var(--text)' }}>
              {card.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-3">

        {/* Spending by Category */}
        <div className="rounded-xl p-4 border"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>

          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Spending by category
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>
              This month
            </span>
          </div>

          {data?.by_category?.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No expenses this month.
            </p>
          )}

          <div className="space-y-3">
            {data?.by_category?.map((cat) => {
              // What % of total does this category represent?
              const pct = data.total_spent > 0
                ? (cat.amount / data.total_spent) * 100
                : 0

              return (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-16 text-xs truncate"
                    style={{ color: 'var(--text-muted)' }}>
                    {cat.name}
                  </div>
                  <div className="flex-1 h-1.5 rounded-full"
                    style={{ background: 'var(--surface2)' }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <div className="text-xs w-16 text-right"
                    style={{ color: 'var(--text-muted)' }}>
                    {taka(cat.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="rounded-xl p-4 border"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>

          <div className="mb-3 text-sm font-semibold"
            style={{ color: 'var(--text-muted)' }}>
            Recent expenses
          </div>

          {data?.recent_expenses?.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No expenses yet.
            </p>
          )}

          <div className="space-y-2">
            {data?.recent_expenses?.map((expense) => (
              <div key={expense.id}
                className="flex items-center gap-2 border-b pb-2 last:border-none"
                style={{ borderColor: 'var(--border)' }}>

                {/* Color dot from category */}
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{
                    background: expense.category?.color ?? '#6366f1',
                    color: '#fff',
                  }}>
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

                <div className="text-sm font-semibold text-red-400">
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