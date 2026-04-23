import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${API_URL}/api/register`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
        input::placeholder { color: #bfb8ae; }
        .inp:focus { border-color: #5b8dd9 !important; box-shadow: 0 0 0 4px rgba(91,141,217,0.12) !important; }
        .btn-reg:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(91,141,217,0.35) !important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0f5ff 0%, #e8f4fd 50%, #f5f0ff 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'relative', overflow:'hidden' }}>

        <div style={{ position:'fixed', top:'-60px', left:'-60px', width:'350px', height:'350px', background:'radial-gradient(circle, rgba(91,141,217,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'fixed', bottom:'-80px', right:'-80px', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(130,100,210,0.08) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        {['🎒','🔑','📱','👜'].map((icon, i) => (
          <div key={i} style={{ position:'fixed', fontSize:'26px', opacity:0.12, animation:`float ${3+i*0.6}s ease-in-out infinite`, animationDelay:`${i*0.8}s`, top:['20%','65%','18%','70%'][i], left:['8%','6%','87%','86%'][i], pointerEvents:'none' }}>{icon}</div>
        ))}

        <div style={{ width:'100%', maxWidth:'440px', animation:'fadeUp 0.5s ease both' }}>

          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div style={{ width:'64px', height:'64px', background:'linear-gradient(135deg, #5b8dd9, #8b5cf6)', borderRadius:'20px', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'30px', marginBottom:'12px', boxShadow:'0 8px 24px rgba(91,141,217,0.3)', animation:'float 3s ease-in-out infinite' }}>🔍</div>
            <div style={{ fontFamily:'Playfair Display, serif', fontSize:'26px', fontWeight:'700', color:'#1e2d4a', letterSpacing:'-0.5px' }}>Lost & Found</div>
            <div style={{ fontSize:'13px', color:'#7a8fa6', marginTop:'4px' }}>Campus Item Management</div>
          </div>

          <div style={{ background:'#fff', borderRadius:'24px', padding:'40px', boxShadow:'0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)', border:'1px solid rgba(255,255,255,0.8)' }}>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'24px', color:'#1e2d4a', marginBottom:'6px' }}>Join the portal</h2>
            <p style={{ color:'#7a8fa6', fontSize:'14px', marginBottom:'28px' }}>Create your account to get started</p>

            {error && (
              <div style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:'12px', padding:'12px 16px', color:'#dc2626', fontSize:'13px', marginBottom:'20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {[
                { name:'name',     label:'FULL NAME',       type:'text',     placeholder:'Your full name' },
                { name:'email',    label:'EMAIL ADDRESS',   type:'email',    placeholder:'you@college.edu' },
                { name:'password', label:'PASSWORD',        type:'password', placeholder:'Min 6 characters' },
              ].map(field => (
                <div key={field.name} style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', fontSize:'11px', fontWeight:'600', color:'#7a8fa6', letterSpacing:'1px', marginBottom:'8px' }}>{field.label}</label>
                  <input
                    className="inp"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={e => setForm({...form, [field.name]: e.target.value})}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused('')}
                    style={{ width:'100%', padding:'13px 16px', background:'#f7f9fc', border:`1.5px solid ${focused === field.name ? '#5b8dd9' : '#e2e8f0'}`, borderRadius:'12px', fontSize:'15px', color:'#1e2d4a', outline:'none', transition:'all 0.2s', fontFamily:'Outfit, sans-serif' }}
                    required minLength={field.name === 'password' ? 6 : undefined}
                  />
                </div>
              ))}

              <button className="btn-reg" type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #5b8dd9, #8b5cf6)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 14px rgba(91,141,217,0.25)', fontFamily:'Outfit, sans-serif', marginTop:'4px' }}>
                {loading ? '⏳ Creating account...' : 'Create Account →'}
              </button>
            </form>

            <div style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#7a8fa6' }}>
              Already registered?{' '}
              <Link to="/" style={{ color:'#5b8dd9', fontWeight:'600', textDecoration:'none' }}>Sign in</Link>
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'12px', color:'#b0bec5' }}>
            🔒 Secured with JWT Authentication
          </p>
        </div>
      </div>
    </>
  );
}