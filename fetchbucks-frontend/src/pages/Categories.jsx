import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

const PRESETS = [
  '#4f9cf9','#6366f1','#8b5cf6','#ec4899',
  '#f43f5e','#f97316','#eab308','#22c55e',
  '#10b981','#14b8a6','#06b6d4','#a78bfa',
]

const injectStyles = () => {
  if (document.getElementById('fb-cat-styles')) return
  const s = document.createElement('style')
  s.id = 'fb-cat-styles'
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
    .fb-fade-up    { animation: fb-fadeUp   0.32s cubic-bezier(0.16,1,0.3,1) both; }

    .fb-input {
      width:100%; background:#080c12; border:1px solid #1a2535;
      border-radius:10px; padding:12px 16px; font-size:15px;
      color:#e8edf5; font-family:'Plus Jakarta Sans',sans-serif;
      outline:none; transition:border-color 0.2s, box-shadow 0.2s;
      box-sizing:border-box;
    }
    .fb-input::placeholder { color:#1f3050; }
    .fb-input:focus { border-color:#4f9cf9; box-shadow:0 0 0 3px rgba(79,156,249,0.12); }

    .fb-cat-card {
      background:#090e14; border:1px solid #0d1825; border-radius:14px;
      padding:18px 20px; display:flex; align-items:center; gap:16px;
      transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    .fb-cat-card:hover { border-color:#1a2d42; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.3); }

    .fb-swatch {
      width:30px; height:30px; border-radius:50%; cursor:pointer;
      border:2px solid transparent; flex-shrink:0;
      transition:transform 0.15s, box-shadow 0.15s;
    }
    .fb-swatch:hover { transform:scale(1.18); }

    .fb-act {
      padding:7px 15px; border-radius:8px; font-size:13px;
      font-weight:500; cursor:pointer; white-space:nowrap;
      font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s;
    }
    .fb-act-edit { background:#0d1117; border:1px solid #1f2d3d; color:#8899aa; }
    .fb-act-edit:hover { border-color:#4f9cf9; color:#4f9cf9; }
    .fb-act-del  { background:transparent; border:1px solid rgba(239,68,68,0.2); color:#f87171; }
    .fb-act-del:hover  { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.4); }

    .fb-stat-card {
      flex:1; padding:20px 24px; border-radius:14px;
      background:#0d1117; border:1px solid #111c27;
      position:relative; overflow:hidden;
      transition:border-color 0.2s, transform 0.2s;
    }
    .fb-stat-card:hover { border-color:#1a2d42; transform:translateY(-2px); }

    .fb-page-header {
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:22px; gap:12px; width:100%;
    }
  `
  document.head.appendChild(s)
}

const empty = { name:'', color:'#4f9cf9' }

export default function Categories() {
  useEffect(() => { injectStyles() }, [])

  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(empty)
  const [editingId, setEditingId]   = useState(null)
  const [error, setError]           = useState('')
  const colorRef = useRef(null)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const res = await api.get('/categories')
    setCategories(res.data); setLoading(false)
  }

  function openAdd()  { setForm(empty); setEditingId(null); setError(''); setShowForm(true) }
  function openEdit(c){ setForm({name:c.name,color:c.color}); setEditingId(c.id); setError(''); setShowForm(true) }

  async function handleSubmit() {
    setError('')
    if (!form.name.trim()) { setError('Name is required.'); return }
    try {
      editingId ? await api.patch(`/categories/${editingId}`,form) : await api.post('/categories',form)
      setShowForm(false); fetchCategories()
    } catch(e) { setError(e.response?.data?.message||'Something went wrong.') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Expenses using it will become uncategorised.')) return
    await api.delete(`/categories/${id}`); fetchCategories()
  }

  if (loading) return <div style={{color:'#3a5270',padding:40,fontSize:16}}>Loading…</div>

  const mostRecent = categories.length ? categories.reduce((a,b)=> a.id>b.id? a : b) : null

  return (
    <div className="fb-page-cols" style={{display:'flex', gap:28, alignItems:'flex-start', width:'100%'}}>

      {/* ══════════════ LEFT COLUMN ══════════════ */}
      <div style={{flex:1, minWidth:0, width:'100%'}}>

        {/* Header — always full width, button always right */}
        <div className="fb-page-header">
          <h1 className="font-display" style={{fontSize:28,fontWeight:800,color:'#e8edf5',margin:0,letterSpacing:'-0.5px',flexShrink:0}}>
            Categories
          </h1>
          <button className="fb-btn fb-btn-primary" onClick={openAdd} style={{flexShrink:0,marginLeft:'auto'}}>
            <span style={{fontSize:20,lineHeight:1,marginTop:-2}}>+</span> Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="fb-slide-down" style={{background:'#0d1117',border:'1px solid #1a2535',borderRadius:16,padding:'26px 28px',marginBottom:22,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${form.color},#6366f1)`,transition:'background 0.3s'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <h2 className="font-display" style={{fontSize:17,fontWeight:700,color:'#c8d8e8',margin:0}}>
                {editingId ? '✎  Edit Category' : '+ New Category'}
              </h2>
              <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:'#3a5270',cursor:'pointer',fontSize:22,lineHeight:1}}>×</button>
            </div>

            <div style={{marginBottom:22}}>
              <label style={{display:'block',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:8}}>Name</label>
              <input className="fb-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Food & Drinks"/>
            </div>

            <div style={{marginBottom:22}}>
              <label style={{display:'block',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:12}}>Color</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:16}}>
                {PRESETS.map(c=>(
                  <button key={c} className="fb-swatch" onClick={()=>setForm({...form,color:c})}
                    style={{background:c,boxShadow:form.color===c?`0 0 0 2px #0d1117, 0 0 0 4px ${c}`:'none',transform:form.color===c?'scale(1.18)':'scale(1)'}}/>
                ))}
                <div style={{position:'relative',width:30,height:30}}>
                  <button className="fb-swatch" onClick={()=>colorRef.current?.click()}
                    style={{background:'conic-gradient(#f43f5e,#f97316,#eab308,#22c55e,#4f9cf9,#8b5cf6,#f43f5e)',boxShadow:!PRESETS.includes(form.color)?`0 0 0 2px #0d1117, 0 0 0 4px ${form.color}`:'none',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#fff',fontWeight:700}} title="Custom colour">+</button>
                  <input ref={colorRef} type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} style={{position:'absolute',opacity:0,width:0,height:0,pointerEvents:'none'}}/>
                </div>
              </div>
              <div style={{padding:'14px 18px',borderRadius:12,background:'#080c12',border:'1px solid #111c27',display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,flexShrink:0,background:`${form.color}20`,border:`1px solid ${form.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,transition:'all 0.25s'}}>◈</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:form.color,transition:'color 0.25s'}}>{form.name||'Category name'}</div>
                  <div style={{fontSize:12,color:'#2d4060',marginTop:3}}>Live preview</div>
                </div>
                <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:20,background:`${form.color}18`,color:form.color,border:`1px solid ${form.color}28`,transition:'all 0.25s'}}>{form.name||'tag'}</span>
              </div>
            </div>

            {error && <div style={{marginBottom:16,padding:'10px 14px',borderRadius:8,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',fontSize:14,color:'#f87171'}}>{error}</div>}

            <div style={{display:'flex',gap:12}}>
              <button className="fb-btn" onClick={handleSubmit} style={{background:`linear-gradient(135deg,${form.color},${form.color}bb)`,color:'#fff',boxShadow:`0 4px 14px ${form.color}40`,transition:'all 0.2s'}}>
                {editingId?'Save Changes':'Add Category'}
              </button>
              <button className="fb-btn fb-btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Category grid */}
        {categories.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 24px',background:'#090e14',borderRadius:16,border:'1px solid #0d1825',display:'flex',flexDirection:'column',alignItems:'center',width:'100%',boxSizing:'border-box'}}>
            <div style={{fontSize:40,marginBottom:14}}>◈</div>
            <p style={{color:'#3a5270',fontSize:16,margin:0,fontWeight:500}}>No categories yet</p>
            <p style={{color:'#1f3050',fontSize:14,marginTop:6}}>Create one to start organising your expenses.</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:14}}>
            {categories.map((cat,i)=>(
              <div key={cat.id} className="fb-cat-card fb-fade-up" style={{animationDelay:`${i*0.06}s`}}>
                <div style={{width:48,height:48,borderRadius:12,flexShrink:0,background:`${cat.color}20`,border:`1px solid ${cat.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:`0 0 16px ${cat.color}12`}}>◈</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:16,fontWeight:700,color:'#c8d8e8',marginBottom:6}}>{cat.name}</div>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:500,padding:'3px 10px',borderRadius:20,background:`${cat.color}18`,color:cat.color,border:`1px solid ${cat.color}25`}}>
                    <span style={{width:7,height:7,borderRadius:'50%',background:cat.color,display:'inline-block'}}/>
                    {cat.name}
                  </span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  <button className="fb-act fb-act-edit" onClick={()=>openEdit(cat)}>Edit</button>
                  <button className="fb-act fb-act-del" onClick={()=>handleDelete(cat.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════ RIGHT COLUMN ══════════════ */}
      <div className="fb-page-sidebar" style={{width:268,flexShrink:0,display:'flex',flexDirection:'column',gap:16}}>
        {[
          {label:'Total Categories', value:categories.length, unit:'created', accent:'#4f9cf9'},
          {label:'Most Recent', value:mostRecent?mostRecent.name:'—', unit:'last added', accent:'#8b5cf6', small:true},
        ].map(({label,value,unit,accent,small})=>(
          <div key={label} className="fb-stat-card">
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:accent,borderRadius:'14px 14px 0 0'}}/>
            <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>{label}</div>
            <div className="font-display" style={{fontSize:small?20:32,fontWeight:800,color:'#e8edf5',letterSpacing:'-0.5px',lineHeight:1}}>{value}</div>
            <div style={{fontSize:13,color:'#2d4060',marginTop:8}}>{unit}</div>
          </div>
        ))}

        {categories.length>0 && (
          <div style={{padding:'20px 22px',borderRadius:14,background:'#0d1117',border:'1px solid #111c27'}}>
            <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:16}}>Your Palette</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {categories.map(cat=>(
                <div key={cat.id} title={cat.name} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 12px',borderRadius:20,background:`${cat.color}14`,border:`1px solid ${cat.color}25`}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:cat.color,boxShadow:`0 0 6px ${cat.color}`}}/>
                  <span style={{fontSize:13,color:cat.color,fontWeight:500}}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{padding:'18px 20px',borderRadius:14,background:'#0d1117',border:'1px solid #111c27'}}>
          <div style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#3a5270',marginBottom:10}}>Tip</div>
          <p style={{fontSize:14,color:'#5a6a80',margin:0,lineHeight:1.6}}>
            Assign a category to each expense so your dashboard spending breakdown stays accurate.
          </p>
        </div>
      </div>
    </div>
  )
}