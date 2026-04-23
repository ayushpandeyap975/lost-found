import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const EMPTY_FORM = { itemName:'', description:'', type:'Lost', location:'', date:'', contactInfo:'' };

const TYPE_META = {
  Lost:  { color:'#ef4444', bg:'#fff5f5', border:'#fecaca', icon:'❌', label:'Lost' },
  Found: { color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', icon:'✅', label:'Found' },
};

export default function Dashboard() {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [search, setSearch]     = useState('');
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg]           = useState({ text:'', type:'' });
  const [focused, setFocused]   = useState('');
  const [filterType, setFilterType] = useState('All');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/items`, { headers });
      setItems(data);
    } catch { navigate('/'); }
    finally { setFetching(false); }
  };

  const showMsg = (text, type='success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const handleSearch = async () => {
    if (!search.trim()) return fetchItems();
    try {
      const { data } = await axios.get(`${API_URL}/api/items/search?name=${search}`, { headers });
      setItems(data);
    } catch { showMsg('Search failed', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/api/items/${editId}`, form, { headers });
        showMsg('✅ Item updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/items`, form, { headers });
        showMsg('✅ Item reported successfully!');
      }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false);
      fetchItems();
    } catch (err) { showMsg(err.response?.data?.message || 'Error occurred', 'error'); }
    finally { setLoading(false); }
  };

  const handleEdit = (item) => {
    setForm({
      itemName: item.itemName, description: item.description || '',
      type: item.type, location: item.location,
      date: item.date?.split('T')[0] || '', contactInfo: item.contactInfo
    });
    setEditId(item._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/api/items/${id}`, { headers });
      showMsg('🗑️ Item deleted');
      fetchItems();
    } catch (err) { showMsg(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const cancelForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); };

  const filtered = items.filter(i => filterType === 'All' || i.type === filterType);

  const inputStyle = (field) => ({
    width:'100%', padding:'11px 14px',
    background: focused === field ? '#fff' : '#f8fafc',
    border:`1.5px solid ${focused === field ? '#e07b4f' : '#e2e8f0'}`,
    boxShadow: focused === field ? '0 0 0 3px rgba(224,123,79,0.1)' : 'none',
    borderRadius:'10px', fontSize:'14px', color:'#1e293b',
    outline:'none', transition:'all 0.2s', fontFamily:'Outfit, sans-serif',
    boxSizing:'border-box',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8fafc; font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        input::placeholder, select option { color: #94a3b8; background: #fff; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius:3px; }
        .item-card { transition: all 0.2s !important; }
        .item-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .logout-btn:hover { background: #fff0f0 !important; color: #ef4444 !important; border-color: #fecaca !important; }
        .filter-pill:hover { background: #f1f5f9 !important; }
        .edit-btn:hover { background: #eff6ff !important; color: #2563eb !important; }
        .del-btn:hover { background: #fff5f5 !important; color: #dc2626 !important; }
        input[type='date']::-webkit-calendar-picker-indicator { cursor:pointer; opacity:0.6; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f8fafc' }}>

        {/* Navbar */}
        <nav style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 32px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#e07b4f,#d45f8a)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🔍</div>
            <div>
              <div style={{ fontFamily:'Playfair Display, serif', fontSize:'17px', fontWeight:'700', color:'#1e293b', lineHeight:1 }}>Lost & Found</div>
              <div style={{ fontSize:'11px', color:'#94a3b8' }}>Campus Portal</div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'7px 14px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#e07b4f,#d45f8a)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:'700' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize:'14px', color:'#475569', fontWeight:'500' }}>{user.name}</span>
            </div>
            <button onClick={() => { setShowForm(!showForm); if(showForm) cancelForm(); }} style={{ background: showForm ? '#f1f5f9' : 'linear-gradient(135deg,#e07b4f,#d45f8a)', border:'none', borderRadius:'10px', padding:'9px 18px', color: showForm ? '#64748b' : '#fff', fontSize:'14px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}>
              {showForm ? '✕ Cancel' : '+ Report Item'}
            </button>
            <button className="logout-btn" onClick={handleLogout} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'9px 16px', color:'#64748b', fontSize:'14px', cursor:'pointer', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}>
              Logout
            </button>
          </div>
        </nav>

        {/* Toast */}
        {msg.text && (
          <div style={{ position:'fixed', top:'80px', right:'24px', zIndex:999, background: msg.type === 'error' ? '#fff5f5' : '#f0fdf4', border:`1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`, borderRadius:'12px', padding:'14px 20px', color: msg.type === 'error' ? '#dc2626' : '#16a34a', fontSize:'14px', fontWeight:'500', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', animation:'toastIn 0.3s ease', maxWidth:'320px' }}>
            {msg.text}
          </div>
        )}

        <div style={{ maxWidth:'1050px', margin:'0 auto', padding:'28px 20px' }}>

          {/* Report/Edit Form */}
          {showForm && (
            <div style={{ background:'#fff', borderRadius:'20px', padding:'28px', marginBottom:'28px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', border:'1px solid #e2e8f0', animation:'slideDown 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'22px' }}>
                <div>
                  <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'20px', color:'#1e293b' }}>
                    {editId ? '✏️ Update Item' : '📋 Report Item'}
                  </h3>
                  <p style={{ fontSize:'13px', color:'#94a3b8', marginTop:'2px' }}>Fill in the details below</p>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={() => setForm({...form, type: form.type === 'Lost' ? 'Found' : 'Lost'})} style={{ background: form.type === 'Lost' ? '#fff5f5' : '#f0fdf4', border:`1px solid ${form.type === 'Lost' ? '#fecaca' : '#bbf7d0'}`, borderRadius:'8px', padding:'7px 14px', color: form.type === 'Lost' ? '#ef4444' : '#16a34a', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    {TYPE_META[form.type].icon} {form.type}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                  {[
                    { key:'itemName',    label:'ITEM NAME',    placeholder:'e.g. Blue Backpack',    type:'text' },
                    { key:'location',    label:'LOCATION',     placeholder:'e.g. Library, Block A', type:'text' },
                    { key:'contactInfo', label:'CONTACT INFO', placeholder:'Phone or Email',        type:'text' },
                    { key:'date',        label:'DATE',         placeholder:'',                      type:'date' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'11px', fontWeight:'600', color:'#94a3b8', letterSpacing:'0.8px', marginBottom:'7px' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm({...form, [f.key]: e.target.value})}
                        onFocus={() => setFocused(f.key)} onBlur={() => setFocused('')}
                        style={{ ...inputStyle(f.key), colorScheme: f.type === 'date' ? 'light' : undefined }}
                        required={['itemName','location','contactInfo'].includes(f.key)}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', fontSize:'11px', fontWeight:'600', color:'#94a3b8', letterSpacing:'0.8px', marginBottom:'7px' }}>DESCRIPTION</label>
                  <input placeholder="Brief description of the item..." value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    onFocus={() => setFocused('desc')} onBlur={() => setFocused('')}
                    style={inputStyle('desc')}
                  />
                </div>

                <div style={{ display:'flex', gap:'10px' }}>
                  <button type="submit" disabled={loading} style={{ background:'linear-gradient(135deg,#e07b4f,#d45f8a)', border:'none', borderRadius:'10px', padding:'12px 28px', color:'#fff', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>
                    {loading ? '⏳ Saving...' : editId ? '✓ Update Item' : '✓ Submit Report'}
                  </button>
                  <button type="button" onClick={cancelForm} style={{ background:'#f1f5f9', border:'none', borderRadius:'10px', padding:'12px 20px', color:'#64748b', fontSize:'14px', cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
            {[
              { label:'Total Reports', value: items.length,                                        icon:'📊', grad:'linear-gradient(135deg,#e07b4f,#d45f8a)', shadow:'rgba(224,123,79,0.2)' },
              { label:'Lost Items',    value: items.filter(i=>i.type==='Lost').length,             icon:'❌', grad:'linear-gradient(135deg,#f87171,#fb923c)', shadow:'rgba(248,113,113,0.2)' },
              { label:'Found Items',   value: items.filter(i=>i.type==='Found').length,            icon:'✅', grad:'linear-gradient(135deg,#34d399,#059669)', shadow:'rgba(52,211,153,0.2)' },
            ].map((stat, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:'16px', padding:'20px 24px', boxShadow:`0 4px 14px ${stat.shadow}`, border:'1px solid #e2e8f0', animation:`fadeUp 0.4s ease ${i*0.1}s both`, display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ width:'48px', height:'48px', background:stat.grad, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize:'28px', fontWeight:'700', fontFamily:'Playfair Display, serif', color:'#1e293b', lineHeight:1 }}>{stat.value}</div>
                  <div style={{ fontSize:'13px', color:'#94a3b8', marginTop:'3px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div style={{ background:'#fff', borderRadius:'16px', padding:'16px 20px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0', display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:'200px', display:'flex', gap:'8px' }}>
              <input
                placeholder="🔎 Search items by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ flex:1, padding:'10px 16px', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', color:'#1e293b', outline:'none', fontFamily:'Outfit, sans-serif' }}
              />
              <button onClick={handleSearch} style={{ background:'linear-gradient(135deg,#e07b4f,#d45f8a)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'600', fontSize:'14px', cursor:'pointer', whiteSpace:'nowrap' }}>Search</button>
              {search && <button onClick={() => { setSearch(''); fetchItems(); }} style={{ background:'#f1f5f9', border:'none', borderRadius:'10px', padding:'10px 14px', color:'#64748b', cursor:'pointer' }}>✕</button>}
            </div>

            <div style={{ display:'flex', gap:'6px' }}>
              {['All','Lost','Found'].map(type => (
                <button key={type} className="filter-pill" onClick={() => setFilterType(type)} style={{ background: filterType === type ? (type === 'Lost' ? '#fff5f5' : type === 'Found' ? '#f0fdf4' : '#fff7ed') : '#f8fafc', border:`1.5px solid ${filterType === type ? (type === 'Lost' ? '#fca5a5' : type === 'Found' ? '#86efac' : '#fdba74') : '#e2e8f0'}`, borderRadius:'20px', padding:'7px 16px', color: filterType === type ? (type === 'Lost' ? '#dc2626' : type === 'Found' ? '#16a34a' : '#ea580c') : '#64748b', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s' }}>
                  {type === 'Lost' ? '❌' : type === 'Found' ? '✅' : '📋'} {type}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'16px' }}>
            {fetching ? (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#94a3b8' }}>
                <div style={{ fontSize:'32px', marginBottom:'12px' }}>⏳</div>
                <div>Loading items...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#94a3b8' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>📭</div>
                <div style={{ fontSize:'16px', fontWeight:'500' }}>No items found</div>
                <div style={{ fontSize:'13px', marginTop:'4px' }}>Try a different filter or search term</div>
              </div>
            ) : filtered.map((item, i) => {
              const meta = TYPE_META[item.type];
              return (
                <div key={item._id} className="item-card" style={{ background:'#fff', borderRadius:'16px', padding:'20px', border:`1px solid #e2e8f0`, boxShadow:'0 2px 8px rgba(0,0,0,0.04)', animation:`fadeUp 0.3s ease ${Math.min(i*0.06,0.4)}s both` }}>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:'12px', fontWeight:'700', padding:'4px 12px', borderRadius:'20px' }}>
                      {meta.icon} {meta.label}
                    </span>
                    <span style={{ fontSize:'12px', color:'#94a3b8' }}>
                      {new Date(item.date || item.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </span>
                  </div>

                  <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#1e293b', marginBottom:'6px', fontFamily:'Playfair Display, serif' }}>
                    {item.itemName}
                  </h3>

                  {item.description && (
                    <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'12px', lineHeight:'1.5' }}>{item.description}</p>
                  )}

                  <div style={{ display:'flex', flexDirection:'column', gap:'5px', marginBottom:'16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#475569' }}>
                      <span>📍</span> {item.location}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#475569' }}>
                      <span>📞</span> {item.contactInfo}
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:'8px', borderTop:'1px solid #f1f5f9', paddingTop:'14px' }}>
                    <button className="edit-btn" onClick={() => handleEdit(item)} style={{ flex:1, padding:'8px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', color:'#475569', fontSize:'13px', fontWeight:'500', cursor:'pointer', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}>
                      ✏️ Edit
                    </button>
                    <button className="del-btn" onClick={() => handleDelete(item._id)} style={{ flex:1, padding:'8px', background:'#fff5f5', border:'1px solid #fecaca', borderRadius:'8px', color:'#ef4444', fontSize:'13px', fontWeight:'500', cursor:'pointer', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}