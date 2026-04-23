import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${API_URL}/api/login`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0eb; font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder { color: #bfb8ae; }
        .inp:focus { border-color: #e07b4f !important; box-shadow: 0 0 0 4px rgba(224,123,79,0.12) !important; }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(224,123,79,0.35) !important; }
        .btn-main:active { transform: translateY(0); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #fdf6f0 0%, #f5ede3 50%, #ede8f5 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'relative', overflow:'hidden' }}>

        {/* Decorative blobs */}
        <div style={{ position:'fixed', top:'-60px', right:'-60px', width:'320px', height:'320px', background:'radial-gradient(circle, rgba(224,123,79,0.12) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'fixed', bottom:'-80px', left:'-80px', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(130,100,210,0.08) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        {/* Floating icons */}
        {['🔍','📦','🏷️','🎒'].map((icon, i) => (
          <div key={i} style={{ position:'fixed', fontSize:'28px', opacity:0.15, animation:`float ${3+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.7}s`, top: ['15%','70%','25%','65%'][i], left: ['10%','8%','85%','88%'][i], pointerEvents:'none' }}>{icon}</div>
        ))}

        <div style={{ width:'100%', maxWidth:'440px', animation:'fadeUp 0.5s ease both' }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div style={{ width:'64px', height:'64px', background:'linear-gradient(135deg, #e07b4f, #d45f8a)', borderRadius:'20px', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'30px', marginBottom:'12px', boxShadow:'0 8px 24px rgba(224,123,79,0.3)', animation:'float 3s ease-in-out infinite' }}>🔍</div>
            <div style={{ fontFamily:'Playfair Display, serif', fontSize:'26px', fontWeight:'700', color:'#2d2520', letterSpacing:'-0.5px' }}>Lost & Found</div>
            <div style={{ fontSize:'13px', color:'#9b8f84', marginTop:'4px' }}>Campus Item Management</div>
          </div>

          {/* Card */}
          <div style={{ background:'#fff', borderRadius:'24px', padding:'40px', boxShadow:'0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)', border:'1px solid rgba(255,255,255,0.8)' }}>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'24px', color:'#2d2520', marginBottom:'6px' }}>Welcome back</h2>
            <p style={{ color:'#9b8f84', fontSize:'14px', marginBottom:'28px' }}>Sign in to manage your items</p>

            {error && (
              <div style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:'12px', padding:'12px 16px', color:'#dc2626', fontSize:'13px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {[
                { name:'email', label:'EMAIL ADDRESS', type:'email', placeholder:'you@college.edu' },
                { name:'password', label:'PASSWORD', type:'password', placeholder:'••••••••' },
              ].map(field => (
                <div key={field.name} style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', fontSize:'11px', fontWeight:'600', color:'#9b8f84', letterSpacing:'1px', marginBottom:'8px' }}>{field.label}</label>
                  <input
                    className="inp"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={e => setForm({...form, [field.name]: e.target.value})}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused('')}
                    style={{ width:'100%', padding:'13px 16px', background:'#faf8f6', border:`1.5px solid ${focused === field.name ? '#e07b4f' : '#ede8e0'}`, borderRadius:'12px', fontSize:'15px', color:'#2d2520', outline:'none', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}
                    required
                  />
                </div>
              ))}

              <button className="btn-main" type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #e07b4f, #d45f8a)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 14px rgba(224,123,79,0.25)', fontFamily:'Outfit, sans-serif', marginTop:'4px' }}>
                {loading ? '⏳ Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#9b8f84' }}>
              New here?{' '}
              <Link to="/register" style={{ color:'#e07b4f', fontWeight:'600', textDecoration:'none' }}>Create account</Link>
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'12px', color:'#bfb8ae' }}>
            🔒 Secured with JWT Authentication
          </p>
        </div>
      </div>
    </>
  );
}