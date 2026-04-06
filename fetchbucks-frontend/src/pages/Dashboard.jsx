function Dashboard() {
  const cards = [
    { label: 'Total Spent', value: '৳0.00', note: 'This month', color: '#4f9cf9' },
    { label: 'Budget', value: '৳0.00', note: 'Set for this month', color: '#a78bfa' },
    { label: 'Remaining', value: '৳0.00', note: 'Left to spend', color: '#34d399' },
  ]

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-(--text) tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm mt-1 text-(--text-muted)">
            Here's what's happening this month.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          📅 April 2026
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative rounded-xl p-4 border overflow-hidden"
            style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
          >

            {/* Top stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: card.color }}
            />

            <p className="text-xs uppercase tracking-wider mb-2 text-(--text-muted)">
              {card.label}
            </p>

            <p className="font-display font-bold text-2xl tracking-tight text-(--text)">
              {card.value}
            </p>

            <p className="text-xs text-(--text-muted) mt-1">
              {card.note}
            </p>
          </div>
        ))}
      </div>

      {/* Row */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-3">

        {/* Chart Section */}
        <div
          className="rounded-xl p-4 border"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
        >
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold text-(--text-muted)">
              Spending by category
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-(--surface2) text-(--text-muted)">
              This month
            </span>
          </div>

          {/* Placeholder bars */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-14 text-xs text-(--text-muted)">Category</div>
                <div className="flex-1 h-1 bg-(--surface2) rounded-full" />
                <div className="text-xs text-(--text-muted) w-10 text-right">৳0</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div
          className="rounded-xl p-4 border"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
        >
          <div className="mb-3 text-sm font-semibold text-(--text-muted)">
            Recent expenses
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 border-b border-(--border) pb-2 last:border-none">
                <div className="w-7 h-7 rounded-md bg-(--surface2) flex items-center justify-center text-sm">
                  🍔
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-(--text) truncate">
                    Expense name
                  </div>
                  <div className="text-xs text-(--text-muted)">
                    Category · Today
                  </div>
                </div>
                <div className="text-sm text-red-400 font-semibold">
                  -৳0
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