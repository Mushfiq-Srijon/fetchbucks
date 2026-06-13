import { useState, useEffect } from 'react'
import api from '../api/axios'

function taka(n) {
  return '৳' + Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2 })
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const empty = { title: '', amount: '', date: '', category_id: '', note: '' }

const injectStyles = () => {
  if (document.getElementById('fb-exp-styles')) return
  const s = document.createElement('style')
  s.id = 'fb-exp-styles'
  s.textContent = `
    @keyframes fb-slideDown {
      from { opacity:0; transform:translateY(-14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fb-fadeUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .fb-slide-down { animation: fb-slideDown 0.28s cubic-bezier(0.16,1,0.3,1) both; }
    .fb-fade-up    { animation: fb-fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both; }

    .fb-input {
      width:100%; background:#080c12; border:1px solid #1a2535;
      border-radius:10px; padding:12px 16px; font-size:15px;
      color:#e8edf5; font-family:'Plus Jakarta Sans',sans-serif;
      outline:none; transition:border-color 0.2s, box-shadow 0.2s;
      box-sizing:border-box;
    }
    .fb-input::placeholder { color:#1f3050; }
    .fb-input:focus { border-color:#4f9cf9; box-shadow:0 0 0 3px rgba(79,156,249,0.12); }
    .fb-input::-webkit-calendar-picker-indicator { filter:invert(0.4); cursor:pointer; }

    .fb-row {
      display:flex; align-items:flex-start; gap:12px;
      padding:14px 16px; border-bottom:1px solid #0d1825;
      transition:background 0.15s; flex-wrap:wrap;
    }
    .fb-row:last-child { border-bottom:none; }
    .fb-row:hover { background:rgba(79,156,249,0.025); }

    .fb-col-header {
      display: none;
    }
    @media (min-width: 768px) {
      .fb-col-header { display: grid; grid-template-columns: 1fr 120px 120px; }
      .fb-row { flex-wrap: nowrap; align-items: center; }
    }

    .fb-icon-tile {
      width:40px; height:40px; border-radius:10px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center; font-size:17px;
    }
    .fb-tag {
      font-size:12px; font-weight:500; padding:3px 10px;
      border-radius:20px; white-space:nowrap;
    }
    .fb-act {
      padding:6px 14px; border-radius:8px; font-size:13px;
      font-weight:500; cursor:pointer; white-space:nowrap;
      font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s;
    }
    .fb-act-edit {
      background:#0d1117; border:1px solid #1f2d3d; color:#8899aa;
    }
    .fb-act-edit:hover { border-color:#4f9cf9; color:#4f9cf9; }
    .fb-act-del {
      background:transparent; border:1px solid rgba(239,68,68,0.2); color:#f87171;
    }
    .fb-act-del:hover { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.4); }

    .fb-stat-card {
      flex:1; padding:20px 24px; border-radius:14px;
      background:#0d1117; border:1px solid #111c27;
      transition: border-color 0.2s, transform 0.2s;
    }
    .fb-stat-card:hover { border-color:#1a2d42; transform:translateY(-2px); }

    .fb-form-card {
      background:#0d1117; border:1px solid #1a2535;
      border-radius:16px; padding:26px 28px;
      margin-bottom:22px; position:relative; overflow:hidden;
    }
    .fb-list-card {
      background:#090e14; border:1px solid #0d1825; border-radius:16px; overflow:hidden;
    }
    .fb-label {
      display:block; font-size:12px; font-weight:600;
      text-transform:uppercase; letter-spacing:0.06em;
      color:#3a5270; margin-bottom:8px;
    }
  `
  document.head.appendChild(s)
}

export default function Expenses() {
  useEffect(() => { injectStyles() }, [])

  const [expenses, setExpenses]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError]         = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [eR, cR] = await Promise.all([api.get('/expenses'), api.get('/categories')])
    setExpenses(eR.data); setCategories(cR.data); setLoading(false)
  }

  function openAdd()  { setForm(empty); setEditingId(null); setError(''); setShowForm(true) }
  function openEdit(e){ setForm({ title:e.title, amount:e.amount, date:e.date, category_id:e.category_id||'', note:e.note||'' }); setEditingId(e.id); setError(''); setShowForm(true) }
  function upd(k)     { return ev => setForm(p=>({...p,[k]:ev.target.value})) }

  async function handleSubmit() {
    setError('')
    if (!form.title||!form.amount||!form.date) { setError('Title, amount and date are required.'); return }
    try {
      editingId ? await api.patch(`/expenses/${editingId}`,form) : await api.post('/expenses',form)
      setShowForm(false); fetchAll()
    } catch(e) { setError(e.response?.data?.message||'Something went wrong.') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return
    await api.delete(`/expenses/${id}`); fetchAll()
  }

  const now = new Date()
  const thisMonth = expenses.filter(e=>{
    const d=new Date(e.date)
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear()
  })
  const totalMonth   = thisMonth.reduce((s,e)=>s+Number(e.amount),0)
  const totalAll     = expenses.reduce((s,e)=>s+Number(e.amount),0)
  const avgExpense   = expenses.length ? (totalAll/expenses.length) : 0

  if (loading) return <div style={{color:'#3a5270',padding:40,fontSize:16}}>Loading…</div>

  return (
    <div className="fb-page-cols" style={{display:'flex', gap:28, alignItems:'flex-start'}}>

      {/* ══════════════ LEFT COLUMN ══════════════ */}
      <div style={{flex:1,minWidth:0}}>

        {/* Page title + Add button */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
          <h1 className="font-display" style={{fontSize:28,fontWeight:800,color:'#e8edf5',margin:0,letterSpacing:'-0.5px'}}>
            Expenses
          </h1>
          <button className="fb-btn fb-btn-primary" onClick={openAdd}>
            <span style={{fontSize:20,lineHeight:1,marginTop:-2}}>+</span> Add Expense
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="fb-form-card fb-slide-down">
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#4f9cf9,#6366f1)'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 className="font-display" style={{fontSize:17,fontWeight:700,color:'#c8d8e8',margin:0}}>
                {editingId ? '✎  Edit Expense' : '+ New Expense'}
              </h2>
              <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:'#3a5270',cursor:'pointer',fontSize:22,lineHeight:1}}>×</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div><label className="fb-label">Title</label>
                <input className="fb-input" value={form.title} onChange={upd('title')} placeholder="e.g. Lunch"/></div>
              <div><label className="fb-label">Amount (৳)</label>
                <input className="fb-input" type="number" value={form.amount} onChange={upd('amount')} placeholder="0.00"/></div>
              <div><label className="fb-label">Date</label>
                <input className="fb-input" type="date" value={form.date} onChange={upd('date')}/></div>
              <div><label className="fb-label">Category</label>
                <select className="fb-input" value={form.category_id} onChange={upd('category_id')} style={{cursor:'pointer'}}>
                  <option value="">— None —</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="fb-label">Note <span style={{color:'#2d4060',textTransform:'none',letterSpacing:0,fontWeight:400}}>(optional)</span></label>
                <input className="fb-input" value={form.note} onChange={upd('note')} placeholder="Any details…"/>
              </div>
            </div>
            {error && <div style={{marginTop:14,padding:'10px 14px',borderRadius:8,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',fontSize:14,color:'#f87171'}}>{error}</div>}
            <div style={{display:'flex',gap:12,marginTop:20}}>
              <button className="fb-btn fb-btn-primary" onClick={handleSubmit}>{editingId?'Save Changes':'Add Expense'}</button>
              <button className="fb-btn fb-btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="fb-list-card">
          {/* Column headers — desktop only */}
          <div className="fb-col-header" style={{padding:'11px 20px',borderBottom:'1px solid #0d1825',fontSize:12,fontWeight:600,color:'#1f3050',textTransform:'uppercase',letterSpacing:'0.07em'}}>
            <span>Description</span>
            <span>Category</span>
            <span style={{textAlign:'right'}}>Amount</span>
          </div>
          {expenses.length===0 ? (
            <div style={{textAlign:'center',padding:'56px 24px'}}>
              <div style={{fontSize:40,marginBottom:14}}>🧾</div>
              <p style={{color:'#3a5270',fontSize:16,margin:0,fontWeight:500}}>No expenses yet</p>
              <p style={{color:'#1f3050',fontSize:14,marginTop:6}}>Hit "Add Expense" to record your first one.</p>
            </div>
          ) : expenses.map((exp,i)=>{
            const cat=categories.find(c=>c.id===exp.category_id)
            return (
              <div key={exp.id} className="fb-row fb-fade-up" style={{animationDelay:`${i*0.04}s`}}>
                <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0,flex:'1 1 320px'}}>
                  <div className="fb-icon-tile" style={{background:cat?.color?`${cat.color}18`:'#131920',border:`1px solid ${cat?.color?`${cat.color}28`:'#1a2535'}`}}>💸</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:600,color:'#c8d8e8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{exp.title}</div>
                    <div style={{fontSize:13,color:'#2d4060',marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {formatDate(exp.date)}{exp.note?` · ${exp.note}`:''}
                    </div>
                  </div>
                </div>
                <div style={{flex:'0 0 130px',minWidth:120}}>
                  {cat
                    ? <span className="fb-tag" style={{background:`${cat.color}18`,color:cat.color,border:`1px solid ${cat.color}28`}}>{cat.name}</span>
                    : <span className="fb-tag" style={{background:'#131920',color:'#2d4060',border:'1px solid #1a2535'}}>None</span>}
                </div>
                <div style={{flex:'0 0 120px',minWidth:90,textAlign:'right',fontSize:16,fontWeight:700,color:'#e8edf5',letterSpacing:'-0.3px'}}>{taka(exp.amount)}</div>
                <div style={{display:'flex',gap:8,flex:'0 0 auto',flexWrap:'wrap',justifyContent:'flex-end',minWidth:0}}>
                  <button className="fb-act fb-act-edit" onClick={()=>openEdit(exp)}>Edit</button>
                  <button className="fb-act fb-act-del" onClick={()=>handleDelete(exp.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════ RIGHT COLUMN ══════════════ */}
      <div className="fb-page-sidebar" style={{width:280,flexShrink:0,display:'flex',flexDirection:'column',gap:16}}>

        {/* Stat cards */}
        {[
          { label:'This Month', value:taka(totalMonth), sub:`${thisMonth.length} expenses`, accent:'#4f9cf9' },
          { label:'Total Recorded', value:taka(totalAll), sub:`across all time`, accent:'#8b5cf6' },
          { label:'Avg per Expense', value:taka(avgExpense), sub:'average amount', accent:'#10b981' },
        ].map(({label,value,sub,accent})=>(
          <div key={label} className="fb-stat-card" style={{position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:accent,borderRadius:'14px 14px 0 0'}}/>
            <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>{label}</div>
            <div className="font-display" style={{fontSize:26,fontWeight:800,color:'#e8edf5',letterSpacing:'-0.5px',lineHeight:1}}>{value}</div>
            <div style={{fontSize:13,color:'#2d4060',marginTop:8}}>{sub}</div>
          </div>
        ))}

        {/* Category breakdown */}
        {categories.length>0 && (
          <div style={{padding:'20px 22px',borderRadius:14,background:'#0d1117',border:'1px solid #111c27'}}>
            <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:16}}>By Category</div>
            {categories.map(cat=>{
              const catTotal=expenses.filter(e=>e.category_id===cat.id).reduce((s,e)=>s+Number(e.amount),0)
              if(!catTotal) return null
              const pct=totalAll>0?Math.round((catTotal/totalAll)*100):0
              return (
                <div key={cat.id} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:14,color:'#8899aa',fontWeight:500}}>{cat.name}</span>
                    <span style={{fontSize:13,color:'#e8edf5',fontWeight:600}}>{pct}%</span>
                  </div>
                  <div style={{height:5,borderRadius:99,background:'#111c27',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,borderRadius:99,background:cat.color,boxShadow:`0 0 6px ${cat.color}60`,transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)'}}/>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}