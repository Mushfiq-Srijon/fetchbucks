import { useState, useEffect } from 'react'
import api from '../api/axios'

function taka(n) {
  return '৳' + Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2 })
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const injectStyles = () => {
  if (document.getElementById('fb-bud-styles')) return
  const s = document.createElement('style')
  s.id = 'fb-bud-styles'
  s.textContent = `
    @keyframes fb-fadeUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fb-fillBar {
      from { width:0; }
    }
    .fb-fade-up { animation: fb-fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }

    .fb-btn {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      padding:13px 24px; border-radius:10px; border:none; width:100%;
      font-size:15px; font-weight:600; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:transform 0.15s, box-shadow 0.15s, filter 0.15s;
    }
    .fb-btn-primary {
      background:linear-gradient(135deg,#4f9cf9,#3b82f6);
      color:#fff; box-shadow:0 4px 14px rgba(79,156,249,0.35);
    }
    .fb-btn-primary:hover { transform:translateY(-1px); filter:brightness(1.1); }

    .fb-month-btn {
      padding:10px 4px; border-radius:9px; font-size:14px; font-weight:500;
      cursor:pointer; background:transparent; border:1px solid transparent;
      color:#3a5270; transition:all 0.15s; text-align:center;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .fb-month-btn:hover:not(.active) { color:#8899aa; background:#0d1117; }
    .fb-month-btn.active {
      background:#0d1117; border-color:#1a2535; color:#e8edf5; font-weight:600;
    }

    .fb-amount-input {
      width:100%; background:#080c12; border:1px solid #1a2535;
      border-radius:12px; padding:16px 18px 16px 44px;
      font-size:26px; font-weight:800; color:#e8edf5;
      font-family:'Outfit',sans-serif; outline:none; letter-spacing:-0.5px;
      transition:border-color 0.2s, box-shadow 0.2s; box-sizing:border-box;
    }
    .fb-amount-input::placeholder { color:#1f3050; }
    .fb-amount-input:focus { border-color:#4f9cf9; box-shadow:0 0 0 3px rgba(79,156,249,0.12); }
    .fb-amount-input::-webkit-outer-spin-button,
    .fb-amount-input::-webkit-inner-spin-button { -webkit-appearance:none; }

    .fb-stat-card {
      padding:20px 24px; border-radius:14px; background:#0d1117;
      border:1px solid #111c27; position:relative; overflow:hidden;
      transition:border-color 0.2s, transform 0.2s;
    }
    .fb-stat-card:hover { border-color:#1a2d42; transform:translateY(-2px); }
  `
  document.head.appendChild(s)
}

export default function Budget() {
  useEffect(() => { injectStyles() }, [])

  const now = new Date()
  const [month, setMonth]       = useState(now.getMonth()+1)
  const [year, setYear]         = useState(now.getFullYear())
  const [amount, setAmount]     = useState('')
  const [spent, setSpent]       = useState(0)
  const [existing, setExisting] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => { fetchData() }, [month, year])

  async function fetchData() {
    setLoading(true); setSaved(false); setError('')
    const [bR, eR] = await Promise.all([api.get('/budgets'), api.get('/expenses')])
    const found = bR.data.find(b=>b.month===month && b.year===year)
    if (found) { setExisting(found); setAmount(found.amount) }
    else       { setExisting(null);  setAmount('') }
    const s = eR.data
      .filter(e=>{ const d=new Date(e.date); return d.getMonth()+1===month && d.getFullYear()===year })
      .reduce((sum,e)=>sum+Number(e.amount),0)
    setSpent(s); setLoading(false)
  }

  async function handleSave() {
    setError('')
    if (!amount||Number(amount)<=0) { setError('Please enter a valid amount.'); return }
    try {
      existing ? await api.patch(`/budgets/${existing.id}`,{amount,month,year}) : await api.post('/budgets',{amount,month,year})
      setSaved(true); fetchData()
    } catch(e) { setError(e.response?.data?.message||'Something went wrong.') }
  }

  const budgetNum = Number(existing?.amount || 0)
  const pct       = budgetNum>0 ? Math.min((spent/budgetNum)*100, 100) : 0
  const remaining = budgetNum - spent
  const isOver    = remaining < 0
  const barColor  = pct>85 ? '#f43f5e' : pct>60 ? '#f97316' : '#4f9cf9'

  // History: past 6 months for the mini chart on the right
  const prevMonths = Array.from({length:5},(_,i)=>{
    const d = new Date(year, month-2-i, 1)
    return { label: MONTHS[d.getMonth()].slice(0,3), month: d.getMonth()+1, year: d.getFullYear() }
  }).reverse()

  return (
    <div style={{display:'flex',gap:28,alignItems:'flex-start'}}>

      {/* ══════════════ LEFT COLUMN ══════════════ */}
      <div style={{flex:1,minWidth:0}}>

        {/* Header */}
        <div style={{marginBottom:24}}>
          <h1 className="font-display" style={{fontSize:28,fontWeight:800,color:'#e8edf5',margin:'0 0 4px',letterSpacing:'-0.5px'}}>
            Budget
          </h1>
          <p style={{margin:0,fontSize:15,color:'#3a5270'}}>Set a monthly limit and track your spending.</p>
        </div>

        {/* Year nav */}
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
          <button onClick={()=>setYear(y=>y-1)} style={{background:'#0d1117',border:'1px solid #1a2535',borderRadius:8,color:'#5a6a80',cursor:'pointer',padding:'7px 14px',fontSize:18,transition:'all 0.15s'}}>‹</button>
          <span className="font-display" style={{fontSize:18,fontWeight:700,color:'#c8d8e8',minWidth:52,textAlign:'center'}}>{year}</span>
          <button onClick={()=>setYear(y=>y+1)} style={{background:'#0d1117',border:'1px solid #1a2535',borderRadius:8,color:'#5a6a80',cursor:'pointer',padding:'7px 14px',fontSize:18,transition:'all 0.15s'}}>›</button>
        </div>

        {/* Month grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,background:'#090e14',border:'1px solid #0d1825',borderRadius:14,padding:10,marginBottom:24}}>
          {MONTHS.map((m,i)=>(
            <button key={i} className={`fb-month-btn${month===i+1?' active':''}`} onClick={()=>setMonth(i+1)}>
              {m.slice(0,3)}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="fb-fade-up" style={{background:'#090e14',border:'1px solid #0d1825',borderRadius:16,overflow:'hidden'}}>

          {/* Card top bar */}
          <div style={{padding:'20px 24px',borderBottom:'1px solid #0d1825',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#2d4060',marginBottom:4}}>
                {MONTHS[month-1]} {year}
              </div>
              <div className="font-display" style={{fontSize:17,fontWeight:700,color:'#8899aa'}}>Monthly Budget</div>
            </div>
            {existing && !loading && (
              <span style={{padding:'5px 14px',borderRadius:20,fontSize:13,fontWeight:500,background:'rgba(79,156,249,0.1)',color:'#4f9cf9',border:'1px solid rgba(79,156,249,0.2)'}}>
                Active
              </span>
            )}
          </div>

          <div style={{padding:24}}>
            {/* Amount input */}
            <div style={{marginBottom:22}}>
              <label style={{display:'block',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>
                Budget Amount
              </label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',fontSize:22,fontWeight:800,color:'#3a5270',fontFamily:"'Outfit',sans-serif",pointerEvents:'none'}}>৳</span>
                <input className="fb-amount-input" type="number" value={amount}
                  onChange={e=>{setAmount(e.target.value);setSaved(false)}} placeholder="0"/>
              </div>
            </div>

            {/* Progress block — visible once budget exists */}
            {existing && !loading && (
              <div style={{background:'#080c12',borderRadius:12,padding:'18px 20px',marginBottom:22,border:'1px solid #0d1825'}}>

                {/* Bar */}
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontSize:14,color:'#3a5270',fontWeight:500}}>Spent so far</span>
                  <span style={{fontSize:14,fontWeight:700,color:isOver?'#f43f5e':'#e8edf5'}}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{height:8,borderRadius:99,background:'#111c27',overflow:'hidden',marginBottom:18}}>
                  <div style={{
                    height:'100%',borderRadius:99,
                    width:`${pct}%`,
                    background: pct>85 ? 'linear-gradient(90deg,#f97316,#f43f5e)' : `linear-gradient(90deg,#4f9cf9,${barColor})`,
                    boxShadow:`0 0 10px ${barColor}70`,
                    animation:'fb-fillBar 0.9s cubic-bezier(0.16,1,0.3,1) both',
                    transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                  }}/>
                </div>

                {/* Three stats */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                  {[
                    {label:'Budget',   val:taka(budgetNum), color:'#4f9cf9'},
                    {label:'Spent',    val:taka(spent),     color:pct>85?'#f43f5e':'#e8edf5'},
                    {label:isOver?'Over by':'Remaining', val:taka(Math.abs(remaining)), color:isOver?'#f43f5e':'#22c55e'},
                  ].map(({label,val,color})=>(
                    <div key={label} style={{textAlign:'center',padding:'12px 8px',borderRadius:10,background:'#0a0f15',border:'1px solid #111c27'}}>
                      <div style={{fontSize:12,color:'#2d4060',marginBottom:6,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}</div>
                      <div className="font-display" style={{fontSize:16,fontWeight:800,color}}>{val}</div>
                    </div>
                  ))}
                </div>

                {isOver && (
                  <div style={{marginTop:14,padding:'10px 14px',borderRadius:9,background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',fontSize:14,color:'#f87171',textAlign:'center'}}>
                    ⚠ You've exceeded this month's budget
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {error && <div style={{marginBottom:16,padding:'10px 14px',borderRadius:8,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',fontSize:14,color:'#f87171'}}>{error}</div>}
            {saved  && <div style={{marginBottom:16,padding:'10px 14px',borderRadius:8,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',fontSize:14,color:'#4ade80',display:'flex',alignItems:'center',gap:8}}>
              <span>✓</span> Budget saved for {MONTHS[month-1]} {year}!
            </div>}

            <button className="fb-btn fb-btn-primary" onClick={handleSave}>
              {existing ? `Update ${MONTHS[month-1]} Budget` : `Set ${MONTHS[month-1]} Budget`}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT COLUMN ══════════════ */}
      <div style={{width:268,flexShrink:0,display:'flex',flexDirection:'column',gap:16,paddingTop:68}}>

        {/* Summary cards */}
        {[
          {label:'This Month\'s Budget', value: existing?taka(budgetNum):'Not set', accent:'#4f9cf9'},
          {label:'Spent This Month',     value: taka(spent),                        accent: spent>budgetNum&&budgetNum>0?'#f43f5e':'#10b981'},
          {label:'Days Left in Month',   value: new Date(year,month,0).getDate()-now.getDate()+'d', accent:'#8b5cf6'},
        ].map(({label,value,accent})=>(
          <div key={label} className="fb-stat-card">
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:accent,borderRadius:'14px 14px 0 0'}}/>
            <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>{label}</div>
            <div className="font-display" style={{fontSize:26,fontWeight:800,color:'#e8edf5',letterSpacing:'-0.5px',lineHeight:1}}>{value}</div>
          </div>
        ))}

        {/* Tip */}
        <div style={{padding:'18px 20px',borderRadius:14,background:'#0d1117',border:'1px solid #111c27'}}>
          <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>Tip</div>
          <p style={{fontSize:14,color:'#5a6a80',margin:0,lineHeight:1.6}}>
            You can set a different budget for each month. Switch months above to review or update past budgets.
          </p>
        </div>
      </div>
    </div>
  )
}