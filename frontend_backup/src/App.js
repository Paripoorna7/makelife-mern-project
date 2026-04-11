import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart, Users, Home, Mail, Phone, MapPin, Calendar, Gift,
  HandHeart, BookOpen, ChevronRight, Plus, Trash2, Menu, X,
  Eye, EyeOff, LogOut, User, Lock, ArrowRight, CheckCircle,
 Shield, BarChart2, TrendingUp, Bell, DollarSign,
  UserCheck, RefreshCw, AlertCircle, Inbox, Image
} from 'lucide-react';

/* ─── API BASE ────────────────────────────────────────────────────────── */
const API = `${process.env.REACT_APP_API_URL}/api`;

const apiFetch = async (path, opts = {}) => {
  const token = localStorage.getItem('ml_token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) };
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    if (!res.ok) throw new Error('Backend route not found — please save the new authRoutes.js and restart your server.');
    return await res.text();
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data;
};

/* ─── helpers ─────────────────────────────────────────────────────────── */
const isValidUrl = s => { try { return s && (s.startsWith('http') || s.startsWith('/uploads/')); } catch { return false; } };
const getPhotoSrc = s => { if (!s) return ''; if (s.startsWith('/uploads/')) return `${process.env.REACT_APP_API_URL}${s}`; return s; };
const isEmoji    = s => { if (!s) return false; return /\p{Emoji}/u.test(s) && s.length <= 4; };
const fmt        = n => isNaN(parseFloat(n)) ? '0' : parseFloat(n).toLocaleString('en-IN');

/* ─── responsive hook ─────────────────────────────────────────────────── */
const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  return { isMobile: w < 640, isTablet: w < 1024, width: w };
};

/* ─── colour tokens ───────────────────────────────────────────────────── */
const C = {
  primary: '#d97757', dark: '#2c1810', mid: '#6b5446', light: '#f0e4d7',
  bg: '#fdf8f4', white: '#ffffff',
  adBg:     '#f7f5f0',
  adSide:   '#2d3a2e',
  adSide2:  '#1e2a1f',
  adAccent: '#5a8a5e',
  adGold:   '#c9975a',
  adCard:   '#ffffff',
  adBorder: '#e8e3dc',
  adText:   '#2a2a25',
  adMid:    '#6b6560',
};

const inputBase = {
  width: '100%', padding: '1rem 1.2rem', fontSize: '16px',
  border: `2px solid ${C.light}`, borderRadius: '14px',
  fontFamily: "'Crimson Pro', Georgia, serif",
  outline: 'none', transition: 'border-color .25s, box-shadow .25s',
  boxSizing: 'border-box', background: C.white, color: C.dark,
  WebkitAppearance: 'none', appearance: 'none',
};
const adminInput = {
  ...inputBase, background: '#faf9f6', border: `2px solid ${C.adBorder}`, color: C.adText,
};
const searchBarStyle = {
  width: '100%', maxWidth: '360px', padding: '.65rem 1rem .65rem 2.6rem',
  fontSize: '.92rem', border: `2px solid ${C.adBorder}`, borderRadius: '50px',
  fontFamily: "'Crimson Pro', Georgia, serif", outline: 'none',
  background: '#faf9f6', color: C.adText, boxSizing: 'border-box',
  transition: 'border-color .2s, box-shadow .2s',
};

const btnP = {
  background: 'linear-gradient(135deg,#d97757,#c65d3f)', color: C.white,
  border: 'none', borderRadius: '50px', padding: '.9rem 1.8rem', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer', fontFamily: "'Crimson Pro', Georgia, serif",
  boxShadow: '0 6px 20px rgba(217,119,87,.35)', transition: 'transform .2s, box-shadow .2s',
  WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
  display: 'inline-flex', alignItems: 'center', gap: '.5rem',
};
const btnO = {
  background: C.white, color: C.primary, border: `2px solid ${C.primary}`,
  borderRadius: '50px', padding: '.9rem 1.8rem', fontSize: '1rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: "'Crimson Pro', Georgia, serif", transition: 'all .2s',
  WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
  display: 'inline-flex', alignItems: 'center', gap: '.5rem',
};
const btnAdmin = {
  background: `linear-gradient(135deg,${C.adAccent},#3d6b41)`, color: '#fff',
  border: 'none', borderRadius: '12px', padding: '.85rem 1.6rem', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer', fontFamily: "'Crimson Pro', Georgia, serif",
  boxShadow: '0 6px 20px rgba(90,138,94,.3)', transition: 'all .2s',
  display: 'inline-flex', alignItems: 'center', gap: '.5rem',
};

/* ══════════════════════════════════════════════════════════════════════
   FLOATING HEARTS
══════════════════════════════════════════════════════════════════════ */
const FloatingHearts = () => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
    {[{s:18,t:'8%',l:'7%',d:0,dr:6},{s:12,t:'18%',l:'85%',d:1.2,dr:7.5},{s:22,t:'35%',l:'92%',d:.4,dr:5.5},{s:10,t:'55%',l:'4%',d:2,dr:8},{s:16,t:'70%',l:'88%',d:.8,dr:6.5},{s:14,t:'80%',l:'15%',d:1.6,dr:7},{s:20,t:'90%',l:'75%',d:.2,dr:5},{s:8,t:'45%',l:'50%',d:3,dr:9}]
      .map((h, i) => (
        <div key={i} style={{ position:'absolute', top:h.t, left:h.l, animation:`floatHeart ${h.dr}s ease-in-out ${h.d}s infinite`, opacity:.12 }}>
          <Heart size={h.s} fill={C.primary} color={C.primary} />
        </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════════════════════════ */
const Overlay = ({ children: ch, onClose }) => (
  <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position:'fixed', inset:0, background:'rgba(44,24,16,.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'1rem', overflowY:'auto' }}>
    {ch}
  </div>
);
const ModalCard = ({ children: ch, maxWidth = 480 }) => (
  <div style={{ background:C.white, borderRadius:'24px', boxShadow:'0 30px 80px rgba(44,24,16,.28)', border:`2px solid ${C.light}`, width:'100%', maxWidth, overflow:'hidden', animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)', maxHeight:'90vh', overflowY:'auto' }}>
    {ch}
  </div>
);
const MH = ({ children: ch, isMobile }) => (
  <div style={{ background:'linear-gradient(135deg,#d97757,#c65d3f)', padding:isMobile?'1.8rem 1.5rem 1.5rem':'2.4rem 2.8rem 2rem', textAlign:'center', position:'relative' }}>{ch}</div>
);
const MB = ({ children: ch, isMobile }) => (
  <div style={{ padding:isMobile?'1.5rem':'2.2rem 2.8rem 2.8rem' }}>{ch}</div>
);
const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.25)', border:'2px solid rgba(255,255,255,.5)', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:'1rem', fontWeight:700, zIndex:10 }}>✕</button>
);
const QuickPicks = ({ value, onSelect }) => (
  <div>
    <p style={{ fontSize:'.9rem', color:C.mid, fontWeight:600, margin:'0 0 .7rem' }}>Quick picks</p>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.5rem', marginBottom:'1.4rem' }}>
      {[200,750,1500,5000].map(q => (
        <button key={q} onClick={() => onSelect(String(q))}
          style={{ padding:'.6rem .2rem', borderRadius:'12px', border:`2px solid ${value===String(q)?C.primary:C.light}`, background:value===String(q)?'#fff3ee':'#fdf8f4', color:value===String(q)?C.primary:C.mid, fontSize:'.88rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
          ₹{q}
        </button>
      ))}
    </div>
  </div>
);
const FieldError = ({ msg }) => msg ? (
  <div style={{ color: '#c0392b', fontSize: '.82rem', fontWeight: 700, marginTop: '.3rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
    <span>⚠</span> {msg}
  </div>
) : null;

/* ══════════════════════════════════════════════════════════════════════
   FORGOT PASSWORD MODAL
══════════════════════════════════════════════════════════════════════ */
const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fi = (e) => {
  const el = e.target;
  if (el && el.style) {
    el.style.borderColor = C.primary;
    el.style.boxShadow = '0 0 0 3px rgba(217,119,87,.12)';
  }
  };
  const fo = (e) => {
  const el = e.target;
  if (el && el.style) {
    el.style.borderColor = C.light;
    el.style.boxShadow = 'none';
  }
  };

  const sendCode = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiFetch('${process.env.REACT_APP_API_URL}/auth/forgot-password', { method:'POST', body: JSON.stringify({ email }) });
      if (data?.code) setCode(String(data.code));
      setStep('sent');
    } catch (err) {
      if (err.message.includes('route not found') || err.message.includes('Backend route')) {
        setError('⚠️ Backend not updated yet. Replace routes/authRoutes.js with the new file and restart your server.');
      } else {
        setError(err.message || 'Could not send reset code. Please try again.');
      }
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!code.trim() || code.length < 4) { setError('Please enter the verification code.'); return; }
    setLoading(true); setError('');
    try {
      await apiFetch('${process.env.REACT_APP_API_URL}/auth/verify-reset-code', { method:'POST', body: JSON.stringify({ email, code }) });
      setStep('reset');
    } catch (err) { setError(err.message || 'Invalid code. Please try again.'); }
    setLoading(false);
  };

  const resetPwd = async () => {
    if (!newPwd || newPwd.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await apiFetch('${process.env.REACT_APP_API_URL}/auth/reset-password', { method:'POST', body: JSON.stringify({ email, code, newPassword: newPwd }) });
      setSuccess('Password reset successfully! You can now sign in.');
      setTimeout(onClose, 2500);
    } catch (err) { setError(err.message || 'Failed to reset password. Please try again.'); }
    setLoading(false);
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(44,24,16,.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:99999, padding:'1rem' }}>
      <div style={{ background:C.white, borderRadius:'24px', boxShadow:'0 30px 80px rgba(44,24,16,.28)', border:`2px solid ${C.light}`, width:'100%', maxWidth:'440px', overflow:'hidden', animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)' }}>
        <div style={{ background:'linear-gradient(135deg,#d97757,#c65d3f)', padding:'2rem 2.4rem 1.6rem', position:'relative', textAlign:'center' }}>
          <button onClick={onClose} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.25)', border:'2px solid rgba(255,255,255,.5)', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontWeight:700 }}>✕</button>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto .8rem' }}>
            {step==='sent'?<Mail size={26} color="#fff"/>:step==='reset'?<Lock size={26} color="#fff"/>:<Shield size={26} color="#fff"/>}
          </div>
          <h3 style={{ color:'#fff', margin:'0 0 .25rem', fontSize:'1.6rem', fontWeight:800, fontFamily:"'Crimson Pro',Georgia,serif" }}>
            {step==='email'?'Forgot Password?':step==='sent'?'Check Your Email':'Reset Password'}
          </h3>
          <p style={{ color:'rgba(255,255,255,.85)', margin:0, fontSize:'.9rem' }}>
            {step==='email'?"We'll send a reset code to your email":step==='sent'?`Code sent to ${email}`:'Enter your new password'}
          </p>
        </div>
        <div style={{ padding:'2rem 2.4rem 2.4rem' }}>
          {success && <div style={{ display:'flex', alignItems:'center', gap:'.7rem', background:'#d4edda', border:'2px solid #c3e6cb', borderRadius:'12px', padding:'.9rem 1.1rem', marginBottom:'1.2rem' }}><CheckCircle size={18} color="#155724"/><span style={{ fontSize:'.95rem', fontWeight:600, color:'#155724', fontFamily:"'Crimson Pro',Georgia,serif" }}>{success}</span></div>}
          {error && <div style={{ background:'#fff0f0', border:'2px solid #f5c6cb', borderRadius:'12px', padding:'.8rem 1.1rem', marginBottom:'1.2rem', fontSize:'.9rem', color:'#c0392b', fontWeight:600 }}>⚠️ {error}</div>}
          {step==='email' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div><label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.4rem', fontSize:'.95rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>Email Address</label>
                <div style={{ position:'relative' }}><Mail size={17} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }}/>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} style={{...inputBase,paddingLeft:'2.8rem'}} onFocus={fi} onBlur={fo} onKeyDown={e=>e.key==='Enter'&&sendCode()} autoFocus/>
                </div>
              </div>
              <button onClick={sendCode} disabled={loading} style={{...btnP,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1.1rem',background:loading?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:loading?'not-allowed':'pointer',boxShadow:'none'}}>{loading?'Sending…':'Send Reset Code'}</button>
              <button onClick={onClose} style={{...btnO,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1rem'}}>Back to Sign In</button>
            </div>
          )}
          {step==='sent' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ background:'#fff8f4', border:'2px solid #f0d5c4', borderRadius:'14px', padding:'1rem 1.2rem', fontSize:'.9rem', color:C.mid, textAlign:'center', lineHeight:1.6 }}>
                🔑 Reset code generated for <strong style={{color:C.primary}}>{email}</strong>. It's pre-filled below.
              </div>
              <div><label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.4rem', fontSize:'.95rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>Verification Code</label>
                <input type="text" placeholder="Enter 6-digit code" value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,''));setError('');}} maxLength={6} style={{...inputBase,textAlign:'center',fontSize:'1.6rem',fontWeight:800,letterSpacing:'0.3em'}} onFocus={fi} onBlur={fo} onKeyDown={e=>e.key==='Enter'&&verifyCode()} autoFocus/>
              </div>
              <button onClick={verifyCode} disabled={loading||code.length<4} style={{...btnP,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1.1rem',background:(loading||code.length<4)?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:(loading||code.length<4)?'not-allowed':'pointer',boxShadow:'none'}}>{loading?'Verifying…':'Verify Code'}</button>
              <button onClick={()=>{setStep('email');setCode('');setError('');}} style={{background:'none',border:'none',color:C.primary,fontWeight:700,cursor:'pointer',fontSize:'.9rem',fontFamily:"'Crimson Pro',Georgia,serif",textDecoration:'underline',padding:'.3rem'}}>← Resend code</button>
            </div>
          )}
          {step==='reset' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div><label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.4rem', fontSize:'.95rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>New Password</label>
                <div style={{ position:'relative' }}><Lock size={17} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }}/>
                  <input type={showPwd?'text':'password'} placeholder="Min. 6 characters" value={newPwd} onChange={e=>{setNewPwd(e.target.value);setError('');}} style={{...inputBase,paddingLeft:'2.8rem',paddingRight:'3rem'}} onFocus={fi} onBlur={fo} autoFocus/>
                  <button onClick={()=>setShowPwd(p=>!p)} type="button" style={{position:'absolute',right:'.9rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.mid,display:'flex',alignItems:'center'}}>{showPwd?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
              </div>
              <div><label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.4rem', fontSize:'.95rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>Confirm Password</label>
                <div style={{ position:'relative' }}><Lock size={17} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }}/>
                  <input type="password" placeholder="Repeat new password" value={confirmPwd} onChange={e=>{setConfirmPwd(e.target.value);setError('');}} style={{...inputBase,paddingLeft:'2.8rem',borderColor:confirmPwd?(confirmPwd===newPwd?'#2a7d4f':'#e63946'):C.light}} onFocus={fi} onBlur={fo} onKeyDown={e=>e.key==='Enter'&&resetPwd()}/>
                </div>
              </div>
              <button onClick={resetPwd} disabled={loading} style={{...btnP,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1.1rem',background:loading?'#ccc':'linear-gradient(135deg,#2a7d4f,#48bb78)',cursor:loading?'not-allowed':'pointer',boxShadow:'none'}}>{loading?'Resetting…':'✓ Reset Password'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   NAV LOGIN DROPDOWN
══════════════════════════════════════════════════════════════════════ */
const NavLoginDropdown = ({ onAuthSuccess, onAdminLogin }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const ch = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };
  const fi = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,87,.12)'; };
  const fo = e => { e.target.style.borderColor = C.light; e.target.style.boxShadow = 'none'; };

  const sw = m => {
    setMode(m); setError(''); setSuccess('');
    setForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowPwd(false); setShowConfirm(false);
  };

  const closeDropdown = () => { setOpen(false); setError(''); setSuccess(''); };

  const strength = (() => {
    const p = form.password; if (!p) return { score: 0, label: '', color: C.light };
    let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return [{ score:1,label:'Weak',color:'#e63946' },{ score:2,label:'Fair',color:'#f4a261' },{ score:3,label:'Good',color:'#2a9d8f' },{ score:4,label:'Strong',color:'#2a7d4f' }].find(m => m.score === s) || { score:0,label:'',color:C.light };
  })();

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.';
    if (!form.password) return 'Password is required.';
    if (mode === 'signup') {
      if (!form.fullName.trim()) return 'Full name is required.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate(); if (err) { setError(err); return; }
    setSubmitting(true); setError('');
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/signin';
      const body = mode === 'signup'
        ? { fullName: form.fullName, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      let data;
      try { data = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
      catch (fetchErr) {
        if (fetchErr.message.includes('fetch') || fetchErr.message.includes('Network')) {
          const demoUser = { name: form.fullName || form.email.split('@')[0], email: form.email };
          if (mode === 'signup') { setSuccess('Account created! Signing you in…'); setTimeout(() => { closeDropdown(); onAuthSuccess(demoUser); }, 1200); }
          else { closeDropdown(); onAuthSuccess(demoUser); }
          setSubmitting(false); return;
        }
        throw fetchErr;
      }
      if (data.token) localStorage.setItem('ml_token', data.token);
      const user = { name: data.user?.fullName || data.user?.name || form.fullName || form.email.split('@')[0], email: data.user?.email || form.email, token: data.token };
      if (mode === 'signup') { setSuccess('Account created! Signing you in…'); setTimeout(() => { closeDropdown(); onAuthSuccess(user); }, 1200); }
      else { closeDropdown(); onAuthSuccess(user); }
    } catch (err) { setError(err.message || 'Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '.45rem',
          background: 'linear-gradient(135deg,#d97757,#c65d3f)',
          color: '#fff',
          border: 'none', borderRadius: '50px',
          padding: '.5rem 1.2rem', fontSize: '.95rem', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif",
          transition: 'all .2s',
          boxShadow: '0 4px 16px rgba(217,119,87,.35)',
          WebkitTapHighlightColor: 'transparent',
          minHeight: '40px',
        }}
      >
        <User size={16} />
        {open ? 'Close' : 'Sign In'}
      </button>

      {open && (
        <>
          <div onClick={closeDropdown} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + .7rem)', right: 0, zIndex: 999,
            width: '390px', maxWidth: 'calc(100vw - 2rem)',
            background: C.white, borderRadius: '22px',
            boxShadow: '0 24px 70px rgba(44,24,16,.2)',
            border: `2px solid ${C.light}`,
            overflow: 'hidden', animation: 'popIn .25s cubic-bezier(.34,1.56,.64,1)',
          }}>
            <button
              onClick={closeDropdown}
              style={{
                position: 'absolute', top: '.7rem', right: '.7rem',
                width: '30px', height: '30px', borderRadius: '50%',
                background: C.light, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: C.mid, zIndex: 10,
                fontWeight: 700, fontSize: '.85rem',
                transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0c9b8'}
              onMouseLeave={e => e.currentTarget.style.background = C.light}
            >
              <X size={14} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fdf8f4', borderBottom: `2px solid ${C.light}` }}>
              {['signin', 'signup'].map(m => (
                <button key={m} onClick={() => sw(m)} style={{
                  background: mode === m ? C.white : 'transparent', border: 'none',
                  borderBottom: mode === m ? `3px solid ${C.primary}` : '3px solid transparent',
                  padding: '.9rem .5rem', fontSize: '.95rem',
                  fontWeight: mode === m ? 800 : 600,
                  color: mode === m ? C.primary : C.mid,
                  cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", transition: 'all .2s',
                }}>
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem 1.6rem 1.8rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: C.dark, margin: '0 0 .2rem' }}>
                {mode === 'signin' ? 'Welcome 👋' : 'Join MakeLife ❤️'}
              </h3>
              <p style={{ fontSize: '.88rem', color: C.mid, margin: '0 0 1.1rem' }}>
                {mode === 'signin' ? 'Sign in to manage profiles and donations.' : 'Create an account to support our children.'}
              </p>

              {success && (
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem', background:'#d4edda', border:'2px solid #c3e6cb', borderRadius:'10px', padding:'.75rem 1rem', marginBottom:'1rem' }}>
                  <CheckCircle size={16} color="#155724" />
                  <span style={{ fontSize:'.9rem', fontWeight:600, color:'#155724' }}>{success}</span>
                </div>
              )}
              {error && (
                <div style={{ background:'#fff0f0', border:'2px solid #f5c6cb', borderRadius:'10px', padding:'.7rem 1rem', marginBottom:'1rem', fontSize:'.88rem', color:'#c0392b', fontWeight:600 }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                {mode === 'signup' && (
                  <div>
                    <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Full Name</label>
                    <div style={{ position:'relative' }}>
                      <User size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                      <input type="text" name="fullName" placeholder="Your full name" value={form.fullName} onChange={ch}
                        style={{ ...inputBase, padding:'.85rem 1rem .85rem 2.6rem' }} onFocus={fi} onBlur={fo} />
                    </div>
                  </div>
                )}
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Email Address</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                    <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={ch}
                      style={{ ...inputBase, padding:'.85rem 1rem .85rem 2.6rem' }}
                      onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Password</label>
                  <div style={{ position:'relative' }}>
                    <Lock size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                    <input type={showPwd ? 'text' : 'password'} name="password"
                      placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                      value={form.password} onChange={ch}
                      style={{ ...inputBase, padding:'.85rem 2.8rem .85rem 2.6rem' }}
                      onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                    <button onClick={() => setShowPwd(p => !p)} type="button"
                      style={{ position:'absolute', right:'.8rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.mid, display:'flex', alignItems:'center' }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === 'signup' && form.password && (
                    <div style={{ marginTop:'.4rem' }}>
                      <div style={{ display:'flex', gap:'.25rem', marginBottom:'.2rem' }}>
                        {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:'3px', borderRadius:'3px', background: i<=strength.score?strength.color:C.light, transition:'background .3s' }} />)}
                      </div>
                      {strength.label && <span style={{ fontSize:'.75rem', fontWeight:700, color:strength.color }}>{strength.label} password</span>}
                    </div>
                  )}
                </div>
                {mode === 'signup' && (
                  <div>
                    <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Confirm Password</label>
                    <div style={{ position:'relative' }}>
                      <Lock size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                      <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat your password"
                        value={form.confirmPassword} onChange={ch}
                        style={{ ...inputBase, padding:'.85rem 2.8rem .85rem 2.6rem', borderColor: form.confirmPassword ? (form.confirmPassword === form.password ? '#2a7d4f' : '#e63946') : C.light }}
                        onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                      <button onClick={() => setShowConfirm(p => !p)} type="button"
                        style={{ position:'absolute', right:'.8rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.mid, display:'flex', alignItems:'center' }}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                {mode === 'signin' && (
                  <div style={{ textAlign:'right', marginTop:'-.3rem' }}>
                    <button onClick={() => { closeDropdown(); setShowForgot(true); }}
                      style={{ background:'none', border:'none', color:C.primary, fontSize:'.85rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                      Forgot password?
                    </button>
                  </div>
                )}
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ ...btnP, width:'100%', justifyContent:'center', padding:'.95rem', fontSize:'.97rem', borderRadius:'12px', marginTop:'.1rem', background: submitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)', cursor: submitting?'not-allowed':'pointer', boxShadow: submitting?'none':'0 6px 20px rgba(217,119,87,.35)' }}>
                  {submitting ? 'Please wait…' : mode === 'signin' ? <><span>Sign In</span><ArrowRight size={16}/></> : <><span>Create Account</span><ArrowRight size={16}/></>}
                </button>
              </div>

              <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'.88rem', color:C.mid, margin:'1rem 0 0' }}>
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => sw(mode === 'signin' ? 'signup' : 'signin')}
                  style={{ background:'none', border:'none', color:C.primary, fontWeight:800, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", fontSize:'.88rem' }}>
                  {mode === 'signin' ? 'Create one' : 'Sign in'}
                </button>
              </p>

              <div style={{ borderTop:`1px solid ${C.light}`, marginTop:'1rem', paddingTop:'.85rem', textAlign:'center' }}>
                <button onClick={() => { closeDropdown(); onAdminLogin(); }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'rgba(45,58,46,.07)', border:'1.5px solid rgba(45,58,46,.15)', borderRadius:'50px', padding:'.35rem .9rem', fontSize:'.78rem', fontWeight:700, color:C.adSide, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                  <Shield size={12} /> Admin Portal →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   LOGIN GATE MODAL
══════════════════════════════════════════════════════════════════════ */
const LoginGateModal = ({ onClose, onAuthSuccess, onAdminLogin }) => {
  const [mode, setMode] = useState('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const ch = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };
  const fi = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,87,.12)'; };
  const fo = e => { e.target.style.borderColor = C.light; e.target.style.boxShadow = 'none'; };

  const sw = m => {
    setMode(m); setError(''); setSuccess('');
    setForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowPwd(false); setShowConfirm(false);
  };

  const strength = (() => {
    const p = form.password; if (!p) return { score: 0, label: '', color: C.light };
    let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return [{ score:1,label:'Weak',color:'#e63946' },{ score:2,label:'Fair',color:'#f4a261' },{ score:3,label:'Good',color:'#2a9d8f' },{ score:4,label:'Strong',color:'#2a7d4f' }].find(m => m.score === s) || { score:0,label:'',color:C.light };
  })();

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.';
    if (!form.password) return 'Password is required.';
    if (mode === 'signup') {
      if (!form.fullName.trim()) return 'Full name is required.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate(); if (err) { setError(err); return; }
    setSubmitting(true); setError('');
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/signin';
      const body = mode === 'signup'
        ? { fullName: form.fullName, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      let data;
      try { data = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
      catch (fetchErr) {
        if (fetchErr.message.includes('fetch') || fetchErr.message.includes('Network')) {
          const demoUser = { name: form.fullName || form.email.split('@')[0], email: form.email };
          if (mode === 'signup') { setSuccess('Account created! Signing you in…'); setTimeout(() => { onClose(); onAuthSuccess(demoUser); }, 1200); }
          else { onClose(); onAuthSuccess(demoUser); }
          setSubmitting(false); return;
        }
        throw fetchErr;
      }
      if (data.token) localStorage.setItem('ml_token', data.token);
      const user = { name: data.user?.fullName || data.user?.name || form.fullName || form.email.split('@')[0], email: data.user?.email || form.email, token: data.token };
      if (mode === 'signup') { setSuccess('Account created! Signing you in…'); setTimeout(() => { onClose(); onAuthSuccess(user); }, 1200); }
      else { onClose(); onAuthSuccess(user); }
    } catch (err) { setError(err.message || 'Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  if (showForgot) return <ForgotPasswordModal onClose={() => setShowForgot(false)} />;

  return (
    <Overlay onClose={onClose}>
      <ModalCard maxWidth={420}>
        <div style={{ background:'linear-gradient(135deg,#d97757,#c65d3f)', padding:'2rem 2.4rem 1.6rem', position:'relative', textAlign:'center' }}>
          <CloseBtn onClick={onClose} />
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto .8rem' }}>
            <Heart size={26} color="#fff" fill="#fff"/>
          </div>
          <h3 style={{ color:'#fff', margin:'0 0 .25rem', fontSize:'1.6rem', fontWeight:800, fontFamily:"'Crimson Pro',Georgia,serif" }}>
            Sign in to Donate
          </h3>
          <p style={{ color:'rgba(255,255,255,.85)', margin:0, fontSize:'.9rem' }}>
            Please sign in or create an account to continue your donation
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fdf8f4', borderBottom: `2px solid ${C.light}` }}>
          {['signin', 'signup'].map(m => (
            <button key={m} onClick={() => sw(m)} style={{
              background: mode === m ? C.white : 'transparent', border: 'none',
              borderBottom: mode === m ? `3px solid ${C.primary}` : '3px solid transparent',
              padding: '.9rem .5rem', fontSize: '.95rem',
              fontWeight: mode === m ? 800 : 600,
              color: mode === m ? C.primary : C.mid,
              cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", transition: 'all .2s',
            }}>
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem 1.8rem 2rem' }}>
          {success && (
            <div style={{ display:'flex', alignItems:'center', gap:'.6rem', background:'#d4edda', border:'2px solid #c3e6cb', borderRadius:'10px', padding:'.75rem 1rem', marginBottom:'1rem' }}>
              <CheckCircle size={16} color="#155724" />
              <span style={{ fontSize:'.9rem', fontWeight:600, color:'#155724' }}>{success}</span>
            </div>
          )}
          {error && (
            <div style={{ background:'#fff0f0', border:'2px solid #f5c6cb', borderRadius:'10px', padding:'.7rem 1rem', marginBottom:'1rem', fontSize:'.88rem', color:'#c0392b', fontWeight:600 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                  <input type="text" name="fullName" placeholder="Your full name" value={form.fullName} onChange={ch}
                    style={{ ...inputBase, padding:'.85rem 1rem .85rem 2.6rem' }} onFocus={fi} onBlur={fo} />
                </div>
              </div>
            )}
            <div>
              <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={ch}
                  style={{ ...inputBase, padding:'.85rem 1rem .85rem 2.6rem' }}
                  onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} autoFocus />
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                <input type={showPwd ? 'text' : 'password'} name="password"
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  value={form.password} onChange={ch}
                  style={{ ...inputBase, padding:'.85rem 2.8rem .85rem 2.6rem' }}
                  onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                <button onClick={() => setShowPwd(p => !p)} type="button"
                  style={{ position:'absolute', right:'.8rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.mid, display:'flex', alignItems:'center' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === 'signup' && form.password && (
                <div style={{ marginTop:'.4rem' }}>
                  <div style={{ display:'flex', gap:'.25rem', marginBottom:'.2rem' }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:'3px', borderRadius:'3px', background: i<=strength.score?strength.color:C.light, transition:'background .3s' }} />)}
                  </div>
                  {strength.label && <span style={{ fontSize:'.75rem', fontWeight:700, color:strength.color }}>{strength.label} password</span>}
                </div>
              )}
            </div>
            {mode === 'signup' && (
              <div>
                <label style={{ display:'block', fontWeight:700, color:C.dark, marginBottom:'.3rem', fontSize:'.88rem' }}>Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:C.mid, pointerEvents:'none' }} />
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat your password"
                    value={form.confirmPassword} onChange={ch}
                    style={{ ...inputBase, padding:'.85rem 2.8rem .85rem 2.6rem', borderColor: form.confirmPassword ? (form.confirmPassword === form.password ? '#2a7d4f' : '#e63946') : C.light }}
                    onFocus={fi} onBlur={fo} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button onClick={() => setShowConfirm(p => !p)} type="button"
                    style={{ position:'absolute', right:'.8rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.mid, display:'flex', alignItems:'center' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            {mode === 'signin' && (
              <div style={{ textAlign:'right', marginTop:'-.3rem' }}>
                <button onClick={() => setShowForgot(true)}
                  style={{ background:'none', border:'none', color:C.primary, fontSize:'.85rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                  Forgot password?
                </button>
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting}
              style={{ ...btnP, width:'100%', justifyContent:'center', padding:'.95rem', fontSize:'.97rem', borderRadius:'12px', marginTop:'.1rem', background: submitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)', cursor: submitting?'not-allowed':'pointer', boxShadow: submitting?'none':'0 6px 20px rgba(217,119,87,.35)' }}>
              {submitting ? 'Please wait…' : mode === 'signin' ? <><span>Sign In & Continue</span><ArrowRight size={16}/></> : <><span>Create Account & Continue</span><ArrowRight size={16}/></>}
            </button>
          </div>

          <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'.88rem', color:C.mid, margin:'1rem 0 0' }}>
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => sw(mode === 'signin' ? 'signup' : 'signin')}
              style={{ background:'none', border:'none', color:C.primary, fontWeight:800, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", fontSize:'.88rem' }}>
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </ModalCard>
    </Overlay>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   ADMIN LOGIN
══════════════════════════════════════════════════════════════════════ */
const AdminLoginPage = ({ onAdminSuccess, onBackToUser }) => {
  const { isMobile } = useBreakpoint();
  const [form, setForm] = useState({ username:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ch = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); setError(''); };
  const fi = e => { e.target.style.borderColor=C.adAccent; e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`; };
  const fo = e => { e.target.style.borderColor=C.adBorder; e.target.style.boxShadow='none'; };

  const handleLogin = async () => {
    if (!form.username.trim()) { setError('Username or email is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    setLoading(true); setError('');

    const demoLogin = () => {
      if ((form.username==='admin'||form.username==='admin@makelife.org') && form.password==='admin123') {
        onAdminSuccess({ name:'Admin', email:'admin@makelife.org', role:'admin', isDemo:true });
      } else {
        setError('Invalid credentials. Use demo: admin / admin123');
      }
    };

    try {
      let res;
      try {
        res = await fetch(`${API}/auth/admin/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
      } catch { demoLogin(); return; }

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) { demoLogin(); return; }

      const data = await res.json();
      if (!res.ok) { setError(data?.error || data?.message || 'Invalid credentials.'); return; }

      if (data.token) localStorage.setItem('ml_admin_token', data.token);
      onAdminSuccess({ name:data.admin?.name||'Admin', email:data.admin?.email||form.username, role:'admin', token:data.token });
    } catch(err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(160deg,#f0ede6 0%,#f7f5f0 50%,#eae7e0 100%)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Crimson Pro',Georgia,serif", padding:'1rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:`radial-gradient(circle,rgba(90,138,94,.12),transparent 65%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-15%', left:'-8%', width:'460px', height:'460px', borderRadius:'50%', background:`radial-gradient(circle,rgba(201,151,90,.1),transparent 65%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(${C.adAccent}18 1px,transparent 1px)`, backgroundSize:'32px 32px', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'440px', position:'relative', zIndex:1, animation:'authPopIn .5s cubic-bezier(.34,1.56,.64,1)' }}>
        <button onClick={onBackToUser} style={{ display:'flex', alignItems:'center', gap:'.4rem', background:'rgba(45,58,46,.07)', border:`1.5px solid rgba(45,58,46,.15)`, borderRadius:'50px', padding:'.4rem 1rem', fontSize:'.82rem', fontWeight:700, color:C.adSide, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", marginBottom:'1.5rem', transition:'all .2s' }}>
          ← Back to Site
        </button>

        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow:`0 16px 48px rgba(90,138,94,.3)`, marginBottom:'1rem' }}>
            <Shield size={40} color="white"/>
          </div>
          <div style={{ fontSize:'2rem', fontWeight:800, color:C.adSide, letterSpacing:'-.02em', lineHeight:1 }}>Admin Portal</div>
          <div style={{ fontSize:'.85rem', color:C.adMid, marginTop:'.3rem' }}>MakeLife Management System</div>
        </div>

        <div style={{ background:'rgba(255,255,255,.85)', backdropFilter:'blur(20px)', borderRadius:'28px', border:`2px solid rgba(45,58,46,.12)`, padding:isMobile?'2rem 1.6rem':'2.6rem', boxShadow:'0 20px 60px rgba(45,58,46,.12)' }}>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, color:C.adText, margin:'0 0 .3rem', letterSpacing:'-.02em' }}>Welcome  👋</h2>
          <p style={{ fontSize:'.9rem', color:C.adMid, margin:'0 0 1.8rem' }}>Sign in with your admin credentials</p>

          {error && <div style={{ background:'#fff0f0', border:`2px solid #f5c6cb`, borderRadius:'12px', padding:'.85rem 1.1rem', marginBottom:'1.2rem', fontSize:'.9rem', color:'#c0392b', fontWeight:600 }}>⚠️ {error}</div>}

          <div style={{ background:`rgba(90,138,94,.08)`, border:`1.5px solid rgba(90,138,94,.2)`, borderRadius:'12px', padding:'.7rem 1rem', marginBottom:'1.4rem', fontSize:'.82rem', color:C.adMid, lineHeight:1.5 }}>
            💡 Demo — username: <strong style={{color:C.adAccent}}>admin</strong> · password: <strong style={{color:C.adAccent}}>admin123</strong>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            <div><label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Username or Email</label>
              <div style={{ position:'relative' }}><User size={17} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none' }}/>
                <input type="text" name="username" placeholder="admin" value={form.username} onChange={ch} style={{...adminInput,paddingLeft:'2.8rem'}} onFocus={fi} onBlur={fo} onKeyDown={e=>e.key==='Enter'&&handleLogin()} autoFocus/>
              </div>
            </div>
            <div><label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Password</label>
              <div style={{ position:'relative' }}><Lock size={17} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none' }}/>
                <input type={showPwd?'text':'password'} name="password" placeholder="••••••••" value={form.password} onChange={ch} style={{...adminInput,paddingLeft:'2.8rem',paddingRight:'3rem'}} onFocus={fi} onBlur={fo} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
                <button onClick={()=>setShowPwd(p=>!p)} type="button" style={{position:'absolute',right:'.9rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.adMid,display:'flex',alignItems:'center'}}>{showPwd?<EyeOff size={18}/>:<Eye size={18}/>}</button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{...btnAdmin,width:'100%',justifyContent:'center',padding:'1.1rem',fontSize:'1.05rem',borderRadius:'14px',background:loading?'#ccc':`linear-gradient(135deg,${C.adAccent},#3d6b41)`,cursor:loading?'not-allowed':'pointer',boxShadow:loading?'none':`0 8px 28px rgba(90,138,94,.3)`}}>
              {loading?'Signing in…':<><Shield size={18}/> Sign In as Admin</>}
            </button>
          </div>
        </div>
        <p style={{ textAlign:'center', fontSize:'.78rem', color:C.adMid, marginTop:'1.2rem' }}>🔐 Restricted access. Authorized personnel only.</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════════════════════════ */
const AdminDashboard = ({ adminUser, onLogout }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [visitedTabs, setVisitedTabs] = useState(new Set(['overview']));
  const [children, setChildren]     = useState([]);
  const [donations, setDonations]   = useState([]);
  const [adoptions, setAdoptions]   = useState([]);
  const [contacts, setContacts]     = useState([]);
const [volunteers, setVolunteers] = useState([]);
  const [volProfiles, setVolProfiles] = useState([]);
  const [searchVolProfiles, setSearchVolProfiles] = useState('');
  const [editingVolProfile, setEditingVolProfile] = useState(null);
  const [deleteVolProfileConfirm, setDeleteVolProfileConfirm] = useState(null);
  const [goodsDonations, setGoodsDonations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adminMembers, setAdminMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState(null);

  // ── NEW: edit child state ──
  const [editingChild, setEditingChild] = useState(null);

  const [adoptionAction, setAdoptionAction] = useState(null);
  const [actionLoading, setActionLoading]   = useState(false);
  const [toast, setToast]                   = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null); // { id, name }
  const [searchDonations,  setSearchDonations]  = useState('');
  const [searchContacts,   setSearchContacts]   = useState('');
  const [searchAdoptions,  setSearchAdoptions]  = useState('');
  const [searchVolunteers, setSearchVolunteers] = useState('');
  const [searchMembers,    setSearchMembers]    = useState('');
  const [searchChildren,   setSearchChildren]   = useState('');
  const [searchGoods,      setSearchGoods]      = useState('');
/* ── Slideshow state ── */
  const [slides, setSlides]                     = useState([]);
  const [slidesLoading, setSlidesLoading]       = useState(false);
  const [slideUploading, setSlideUploading]     = useState(false);
  const [slideDeleteConfirm, setSlideDeleteConfirm] = useState(null);
  const [founderStory, setFounderStory] = useState({
  founderName: '', founderRole: '', founderBio: '',
  founderPhoto: '', story1: '', story2: '', story3: '',
});
const [founderPhotoFile, setFounderPhotoFile] = useState(null);
const [founderPhotoPreview, setFounderPhotoPreview] = useState('');
const [founderSaving, setFounderSaving] = useState(false);
const [founderLoading, setFounderLoading] = useState(false);
  const slideInputRef = useRef(null);
  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const goToTab = (tabId) => {
    setTab(tabId);
    setVisitedTabs(prev => new Set([...prev, tabId]));
    if (isMobile) setSidebarOpen(false);
  };

  const adminFetch = async (path, opts = {}) => {
    const token = localStorage.getItem('ml_admin_token') || localStorage.getItem('ml_token');
    const isFormData = opts.body instanceof FormData;
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(opts.headers || {}),
    };
    const res = await fetch(`${API}${path}`, { ...opts, headers });
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('json') ? await res.json() : await res.text();
    if (!res.ok) throw new Error(data?.error || data?.message || (typeof data === 'string' ? data.slice(0, 120) : `HTTP ${res.status}`));
    return data;
  };
  const fetchFounderStory = useCallback(async () => {
  setFounderLoading(true);
  try {
    const r = await adminFetch('/founder-story');
    if (r && typeof r === 'object') {
      setFounderStory({
        founderName:  r.founderName  || '',
        founderRole:  r.founderRole  || '',
        founderBio:   r.founderBio   || '',
        founderPhoto: r.founderPhoto || '',
        story1: r.story1 || '',
        story2: r.story2 || '',
        story3: r.story3 || '',
      });
    }
  } catch {
    try {
      const saved = JSON.parse(localStorage.getItem('ml_founder_story') || 'null');
      if (saved) setFounderStory(prev => ({ ...prev, ...saved }));
    } catch {}
  } finally { setFounderLoading(false); }
}, []);
  const fetchSlides = useCallback(async () => {
    setSlidesLoading(true);
    try {
      const r = await adminFetch('/slides');
      setSlides(Array.isArray(r) ? r : (r.slides || []));
    } catch {
      try {
        const saved = JSON.parse(localStorage.getItem('ml_slides') || '[]');
        setSlides(saved);
      } catch { setSlides([]); }
    } finally { setSlidesLoading(false); }
  }, []);
  const fetchAll = useCallback(async (silent=false) => {
    if (!silent) setLoadingData(true);
    else setRefreshing(true);
    try {
   const [cr, dr, ar, conr, vr, mr, gdr] = await Promise.allSettled([
        adminFetch('/children'), adminFetch('/donations'), adminFetch('/adoptions'),
        adminFetch('/contact'), adminFetch('/volunteers'), adminFetch('/members'),
        adminFetch('/goods-donations'),
      ]);
      if (cr.status==='fulfilled') setChildren(Array.isArray(cr.value)?cr.value:(cr.value?.children||[]));
      if (dr.status==='fulfilled') { const l=Array.isArray(dr.value)?dr.value:(dr.value?.donations||[]); setDonations(l); }
      if (ar.status==='fulfilled') setAdoptions(Array.isArray(ar.value)?ar.value:(ar.value?.adoptions||[]));
      if (conr.status==='fulfilled') setContacts(Array.isArray(conr.value)?conr.value:(conr.value?.contacts||[]));
      if (vr.status==='fulfilled') setVolunteers(Array.isArray(vr.value)?vr.value:(vr.value?.volunteers||[]));
      if (mr.status==='fulfilled') {
  let ml = Array.isArray(mr.value)?mr.value:(mr.value?.members||[]);
  // Restore sort order from localStorage if backend doesn't have it
  try {
    const savedOrder = JSON.parse(localStorage.getItem('ml_member_order')||'{}');
    if(Object.keys(savedOrder).length>0) {
      ml = ml.map(m => savedOrder[m._id] ? {...m, sortOrder: savedOrder[m._id]} : m);
    }
  } catch {}
  setAdminMembers(ml);
}
     if (gdr.status==='fulfilled') {
        const gl = Array.isArray(gdr.value) ? gdr.value : (gdr.value?.goodsDonations || []);
        setGoodsDonations(gl);
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem('ml_goods_donations') || '[]');
          setGoodsDonations(saved);
        } catch { setGoodsDonations([]); }
      }
      if ([cr,dr,ar,conr,vr,mr,gdr].every(r=>r.status==='rejected')) {
        setChildren([{_id:'1',name:'Sarah',age:8,gender:'Girl',story:'Loves painting and dreams of becoming an artist',photo:'🎨'},{_id:'2',name:'Michael',age:10,gender:'Boy',story:'Passionate about science and wants to be a doctor',photo:'🔬'},{_id:'3',name:'Emma',age:6,gender:'Girl',story:'Enjoys reading and playing with friends',photo:'📚'},{_id:'4',name:'David',age:12,gender:'Boy',story:'Talented musician learning to play the guitar',photo:''}]);
       setDonations([
  {_id:'d1',donorName:'Priya Sharma',donorEmail:'priya@example.com',donorPhone:'+91 98765 43210',amount:1500,childName:'Sarah',createdAt:new Date().toISOString()},
  {_id:'d2',donorName:'Rahul Verma',donorEmail:'rahul@example.com',donorPhone:'+91 91234 56789',amount:750,childName:'Michael',createdAt:new Date(Date.now()-86400000).toISOString()},
  {_id:'d3',donorName:'Ananya Singh',donorEmail:'ananya@example.com',donorPhone:'+91 98765 11111',amount:5000,childName:null,createdAt:new Date(Date.now()-172800000).toISOString()},
  {_id:'d4',donorName:'Vikram Nair',donorEmail:'vikram@example.com',donorPhone:'+91 98765 22222',amount:2000,childName:'Emma',createdAt:new Date(Date.now()-259200000).toISOString()}
]);
        setAdoptions([{_id:'a1',applicantName:'Sanjay Patel',childName:'Emma',childId:'3',phone:'+91 98765 43210',email:'sanjay@example.com',annualIncome:800000,familyMembers:4,reason:'We have always wanted to give a child a loving home.',status:'pending',createdAt:new Date().toISOString()},{_id:'a2',applicantName:'Meera Iyer',childName:'Sarah',childId:'1',phone:'+91 91234 56789',email:'meera@example.com',annualIncome:1200000,familyMembers:3,reason:'My husband and I have been waiting for years to adopt.',status:'approved',createdAt:new Date(Date.now()-604800000).toISOString()}]);
        setContacts([{_id:'c1',name:'Rohan Gupta',email:'rohan@example.com',phone:'+91 9876543210',message:'I would like to volunteer at your orphanage on weekends.',replied:false,createdAt:new Date().toISOString()},{_id:'c2',name:'Sunita Desai',email:'sunita@example.com',phone:'',message:'How can I make a recurring monthly donation?',replied:true,createdAt:new Date(Date.now()-86400000).toISOString()}]);
        setVolunteers([{_id:'v1',fullName:'Aditi Menon',email:'aditi@example.com',phone:'+91 98765 11111',age:25,occupation:'Teacher',availability:'weekends',areas:['teaching','arts'],motivation:'I want to give back to the community.',status:'pending',createdAt:new Date().toISOString()},{_id:'v2',fullName:'Karan Mehta',email:'karan@example.com',phone:'+91 91234 22222',age:30,occupation:'Doctor',availability:'weekdays',areas:['medical','counseling'],motivation:'Healthcare for underprivileged children is my passion.',status:'approved',createdAt:new Date(Date.now()-172800000).toISOString()}]);
      }
      setLastRefresh(new Date());
    } finally { setLoadingData(false); setRefreshing(false); }
  }, []);

useEffect(() => {
  fetchAll();
  fetchSlides();
  fetchFounderStory();
  try {
    const saved = JSON.parse(localStorage.getItem('ml_vol_profiles') || '[]');
    setVolProfiles(saved);
  } catch {}
}, [fetchAll, fetchSlides, fetchFounderStory]);
  const handleSlideUpload = async (files) => {
    if (!files || files.length === 0) return;
    setSlideUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const token = localStorage.getItem('ml_admin_token') || localStorage.getItem('ml_token');
        const fd = new FormData();
        fd.append('photo', file);
        let photoUrl = null;
        try {
          const ur = await fetch(`${API}/upload`, { method:'POST', body:fd, headers: token ? { Authorization:`Bearer ${token}` } : {} });
          if (ur.ok) {
            const res = await ur.json();
            photoUrl = res.url || res.path || res.filename;
            if (photoUrl && !photoUrl.startsWith('http')) photoUrl = `${process.env.REACT_APP_API_URL}/${photoUrl}`;
          }
        } catch {}
        if (!photoUrl) photoUrl = URL.createObjectURL(file);
        let savedSlide = null;
        try { savedSlide = await adminFetch('/slides', { method:'POST', body: JSON.stringify({ url: photoUrl }) }); } catch {}
        const newSlide = savedSlide || { _id:`local_${Date.now()}_${Math.random()}`, url:photoUrl, createdAt:new Date().toISOString() };
        setSlides(prev => {
          const updated = [...prev, newSlide];
          try { localStorage.setItem('ml_slides', JSON.stringify(updated)); } catch {}
          return updated;
        });
        successCount++;
      } catch (err) { showToast(`Failed to upload ${file.name}: ${err.message}`, 'error'); }
    }
    if (successCount > 0) showToast(`${successCount} photo${successCount > 1 ? 's' : ''} added to homepage slideshow.`);
    setSlideUploading(false);
    if (slideInputRef.current) slideInputRef.current.value = '';
  };

  const confirmDeleteSlide = async () => {
    const { id } = slideDeleteConfirm;
    setSlideDeleteConfirm(null);
    try { await adminFetch(`/slides/${id}`, { method:'DELETE' }); } catch {}
    setSlides(prev => {
      const updated = prev.filter(s => s._id !== id);
      try { localStorage.setItem('ml_slides', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Photo removed from slideshow.');
  };
  const handleAdoptionStatus = async (id, status) => {
    setActionLoading(true);
    try { await adminFetch(`/adoptions/${id}`, { method:'PATCH', body:JSON.stringify({status}) }); } catch {}
    setAdoptions(prev => prev.map(a => a._id===id ? {...a,status} : a));
    showToast(`Application ${status}. (Demo mode)`);
    setActionLoading(false); setAdoptionAction(null);
  };

  const handleDeleteChild = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDeleteChild = async () => {
    const { id, name } = deleteConfirm;
    setDeleteConfirm(null);
    try { await adminFetch(`/children/${id}`, { method:'DELETE' }); } catch {}
    setChildren(prev => prev.filter(c => c._id !== id));
    showToast(`${name}'s profile has been deleted.`);
  };

  // ── NEW: save edited child ──
  const handleSaveChild = async () => {
    try {
      if (editingChild._newPhotoFile) {
        const fd = new FormData();
        fd.append('name',   editingChild.name);
        fd.append('age',    String(editingChild.age));
        fd.append('gender', editingChild.gender || '');
        fd.append('story',  editingChild.story);
        fd.append('photo',  editingChild._newPhotoFile);
        const updated = await adminFetch(`/children/${editingChild._id}`, { method:'PUT', body:fd });
        setChildren(prev => prev.map(c => c._id===editingChild._id ? updated : c));
      } else {
        const {_newPhotoFile, _newPhotoPreview, ...clean} = editingChild;
        await adminFetch(`/children/${editingChild._id}`, { method:'PUT', body:JSON.stringify(clean) });
        setChildren(prev => prev.map(c => c._id===editingChild._id ? {...clean} : c));
      }
      showToast(`${editingChild.name}'s profile updated successfully.`);
      setEditingChild(null);
    } catch(err) { showToast(err.message, 'error'); }
  };

  const handleAddChild = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const photoFile = fd.get('photo');
      if (!photoFile||photoFile.size===0){ showToast('Please select a photo before submitting.','error'); return; }
      const up=new FormData(); up.append('photo',photoFile);
      const token=localStorage.getItem('ml_admin_token')||localStorage.getItem('ml_token');
      const ur=await fetch(`${API}/upload`,{method:'POST',body:up,headers:token?{Authorization:`Bearer ${token}`}:{}});
      if(!ur.ok){const t=await ur.text();throw new Error('Photo upload failed: '+t.slice(0,200));}
      const uploadResult=await ur.json();
      const url=uploadResult.url||uploadResult.path||uploadResult.filename;
      if(!url) throw new Error('Upload succeeded but no URL returned.');
      const childData={name:fd.get('name'),age:parseInt(fd.get('age')),gender:fd.get('gender')||'',story:fd.get('story'),photo:url};
      const saved=await adminFetch('/children',{method:'POST',body:JSON.stringify(childData)});
      setChildren(prev=>[...prev,saved]);
      setShowAddForm(false); e.target.reset();
      const pv=document.getElementById('admin-photo-preview'); if(pv) pv.style.display='none';
      showToast(`${childData.name}'s profile has been added successfully.`);
    } catch(err){showToast(err.message,'error');}
  };

  const markReplied = async id => {
    try { await adminFetch(`/contact/${id}`, { method:'PATCH', body:JSON.stringify({replied:true}) }); } catch {}
    setContacts(prev => prev.map(c => c._id===id ? {...c,replied:true} : c));
    showToast('Marked as replied.');
  };

  const totalRaised = donations.reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const pendingAdoptions = adoptions.filter(a=>!a.status||a.status==='pending').length;
  const unreadContacts   = contacts.filter(c=>!c.replied).length;
  const showBadge = (tabId, count) => count > 0 && !visitedTabs.has(tabId);

const TABS = [
    {id:'overview',           label:'Overview',          icon:<BarChart2 size={18}/>},
    {id:'slideshow',          label:'Slideshow',         icon:<Image size={18}/>,      badge:slides.length, alwaysShow:true},
    {id:'our-story',          label:'Our Story',         icon:<BookOpen size={18}/>,   badge:0, alwaysShow:true},
    {id:'children',           label:'Children',          icon:<Users size={18}/>,      badge:children.length, alwaysShow:true},
    {id:'members',            label:'Members',           icon:<UserCheck size={18}/>,  badge:adminMembers.length, alwaysShow:true},
    {id:'donations',          label:'Money Donations',   icon:<DollarSign size={18}/>, badge:donations.length, alwaysShow:true},
    {id:'goods-donations',    label:'Goods Donations',   icon:<Gift size={18}/>,       badge:goodsDonations.filter(g=>g.status==='pending').length, badgeAlert:true, alwaysShow:true},
    {id:'adoptions',          label:'Adoptions',         icon:<UserCheck size={18}/>,  badge:pendingAdoptions, badgeAlert:true},
    {id:'contacts',           label:'Messages',          icon:<Inbox size={18}/>,      badge:unreadContacts, badgeAlert:true},
    {id:'vol-requests',       label:'Vol. Requests',     icon:<HandHeart size={18}/>,  badge:volunteers.filter(v=>v.status==='pending').length, badgeAlert:true},
    {id:'vol-profiles',       label:'Vol. Profiles',     icon:<Users size={18}/>,      badge:volunteers.filter(v=>v.status==='approved').length, alwaysShow:true},
  ];

  const sW = 248;
  const stats = [
    {label:'Children',     value:children.length,        icon:<Users size={20}/>,      color:C.adAccent, bg:'#eef4ee', trend:'Total profiles',          tabTarget:'children'},
    {label:'Total Raised', value:`₹${fmt(totalRaised)}`, icon:<TrendingUp size={20}/>, color:'#c9975a',  bg:'#fdf3e8', trend:`${donations.length} donors`,tabTarget:'donations'},
    {label:'Adoptions',    value:adoptions.length,       icon:<UserCheck size={20}/>,  color:'#5a7a9a',  bg:'#eaf0f6', trend:`${pendingAdoptions} pending`,tabTarget:'adoptions'},
    {label:'New Messages', value:unreadContacts,         icon:<Inbox size={20}/>,      color:'#9a5a7a',  bg:'#f6eaf0', trend:`${contacts.length} total`,  tabTarget:'contacts'},
  ];

  const fi = e => { e.target.style.borderColor=C.adAccent; e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`; };
  const fo = e => { e.target.style.borderColor=C.adBorder; e.target.style.boxShadow='none'; };

  return (
    <div style={{ minHeight:'100vh', background:C.adBg, fontFamily:"'Crimson Pro',Georgia,serif", display:'flex', position:'relative' }}>
      {toast && (
        <div style={{ position:'fixed', top:'1.2rem', right:'1.2rem', zIndex:9999, background:toast.type==='error'?'#fff0f0':'#eef4ee', border:`2px solid ${toast.type==='error'?'#f5c6cb':'rgba(90,138,94,.3)'}`, borderRadius:'14px', padding:'.85rem 1.2rem', boxShadow:'0 8px 28px rgba(0,0,0,.12)', display:'flex', alignItems:'center', gap:'.7rem', animation:'slideLeft .3s ease', maxWidth:'320px' }}>
          <CheckCircle size={18} color={toast.type==='error'?'#c0392b':C.adAccent}/>
          <span style={{ fontSize:'.9rem', fontWeight:600, color:toast.type==='error'?'#c0392b':C.adText }}>{toast.msg}</span>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {slideDeleteConfirm && (
        <Overlay onClose={()=>setSlideDeleteConfirm(null)}>
          <div style={{ background:C.white, borderRadius:'24px', maxWidth:'400px', width:'100%',
            animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.18)', overflow:'hidden' }}>
            <div style={{ background:'linear-gradient(135deg,#c0392b,#e74c3c)', padding:'1.6rem 2rem',
              position:'relative', textAlign:'center' }}>
              <button onClick={()=>setSlideDeleteConfirm(null)} style={{ position:'absolute', top:'.8rem', right:'.8rem',
                background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%',
                width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', color:'#fff', fontWeight:700 }}>✕</button>
              <div style={{ fontSize:'2rem', marginBottom:'.4rem' }}>🖼️</div>
              <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff' }}>Remove from Slideshow?</div>
              <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.8)', marginTop:'.2rem' }}>
                This photo will be removed from the homepage
              </div>
            </div>
            <div style={{ padding:'1.6rem 2rem 2rem' }}>
              <div style={{ borderRadius:'12px', overflow:'hidden', marginBottom:'1.4rem',
                height:'140px', background:'#f0ede6' }}>
                <img src={slideDeleteConfirm.url} alt="preview"
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e=>e.target.style.display='none'}/>
              </div>
              <div style={{ display:'flex', gap:'.8rem' }}>
                <button onClick={()=>setSlideDeleteConfirm(null)} style={{ flex:1, padding:'1rem',
                  borderRadius:'12px', border:`2px solid ${C.adBorder}`, background:C.white,
                  color:C.adMid, fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                  Cancel
                </button>
                <button onClick={confirmDeleteSlide} style={{ flex:1, padding:'1rem', borderRadius:'12px',
                  border:'none', background:'linear-gradient(135deg,#c0392b,#e74c3c)', color:'#fff',
                  fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
      {deleteConfirm && (
        <Overlay onClose={()=>setDeleteConfirm(null)}>
          <div style={{ background:C.white, borderRadius:'24px', padding:'0', maxWidth:'420px', width:'100%', animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.18)', overflow:'hidden' }}>
            {/* Header */}
            <div style={{ background:'linear-gradient(135deg,#c0392b,#e74c3c)', padding:'1.8rem 2rem', position:'relative', textAlign:'center' }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontWeight:700, fontSize:'.85rem' }}>✕</button>
              <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto .8rem', fontSize:'1.8rem' }}></div>
              <div style={{ fontSize:'1.3rem', fontWeight:800, color:'#fff', lineHeight:1.2 }}>Delete Child Profile</div>
              <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.8)', marginTop:'.3rem' }}>This action cannot be undone</div>
            </div>
            {/* Body */}
            <div style={{ padding:'1.8rem 2rem 2rem', textAlign:'center' }}>
              <p style={{ fontSize:'1rem', color:C.adText, lineHeight:1.7, margin:'0 0 1.6rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                Are you sure you want to delete <strong style={{ color:'#c0392b' }}>{deleteConfirm.name}</strong>'s profile? All information associated with this child will be permanently removed.
              </p>
              <div style={{ display:'flex', gap:'.8rem', justifyContent:'center' }}>
                <button
                  onClick={()=>setDeleteConfirm(null)}
                  style={{ flex:1, padding:'1rem', borderRadius:'12px', border:`2px solid ${C.adBorder}`, background:C.white, color:C.adMid, fontWeight:700, fontSize:'.95rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", transition:'all .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#faf9f6'}
                  onMouseLeave={e=>e.currentTarget.style.background=C.white}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteChild}
                  style={{ flex:1, padding:'1rem', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#c0392b,#e74c3c)', color:'#fff', fontWeight:700, fontSize:'.95rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", boxShadow:'0 4px 16px rgba(192,57,43,.35)', transition:'all .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.opacity='.88'}
                  onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── EDIT CHILD MODAL ── */}
      {editingChild && (
        <Overlay onClose={()=>setEditingChild(null)}>
          <div style={{ background:C.white, borderRadius:'24px', padding:'0', maxWidth:'520px', width:'100%', animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.18)', maxHeight:'90vh', overflowY:'auto' }}>
            {/* Modal header */}
            <div style={{ background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, padding:'1.6rem 2rem', position:'relative', borderRadius:'24px 24px 0 0' }}>
              <button onClick={()=>setEditingChild(null)} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontWeight:700, fontSize:'.85rem' }}>✕</button>
              <div style={{ display:'flex', alignItems:'center', gap:'.8rem' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>
                  {isValidUrl(editingChild.photo) ? <img src={getPhotoSrc(editingChild.photo)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px' }}/> : (isEmoji(editingChild.photo) ? editingChild.photo : '👶')}
                </div>
                <div>
                  <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff', lineHeight:1 }}>Edit Child Profile</div>
                  <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.7)', marginTop:'.2rem' }}>Update {editingChild.name}'s details</div>
                </div>
              </div>
            </div>
            {/* Modal body */}
            <div style={{ padding:'1.8rem 2rem 2rem' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Full Name</label>
                  <input
                    type="text"
                    value={editingChild.name}
                    onChange={e=>setEditingChild(p=>({...p,name:e.target.value}))}
                    style={adminInput}
                    onFocus={fi} onBlur={fo}
                    placeholder="Child's name"
                  />
                </div>
                {/* Age + Gender row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Age</label>
                    <input
                      type="number" min="1" max="18"
                      value={editingChild.age}
                      onChange={e=>setEditingChild(p=>({...p,age:parseInt(e.target.value)||p.age}))}
                      style={adminInput}
                      onFocus={fi} onBlur={fo}
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Gender</label>
                    <select
                      value={editingChild.gender||''}
                      onChange={e=>setEditingChild(p=>({...p,gender:e.target.value}))}
                      style={{...adminInput,cursor:'pointer'}}
                      onFocus={fi} onBlur={fo}
                    >
                      <option value="">Select Gender</option>
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                    </select>
                  </div>
                </div>
                {/* Story */}
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Story / Description</label>
                  <textarea
                    rows="4"
                    value={editingChild.story}
                    onChange={e=>setEditingChild(p=>({...p,story:e.target.value}))}
                    style={{...adminInput,resize:'vertical'}}
                    onFocus={fi} onBlur={fo}
                    placeholder="Tell the child's story..."
                  />
                </div>
                {/* Photo URL (optional manual override) */}
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Photo URL <span style={{ fontWeight:400, color:C.adMid, fontSize:'.8rem' }}>(optional — leave as-is to keep current)</span></label>
                  <input
                    type="text"
                    value={editingChild.photo||''}
                    onChange={e=>setEditingChild(p=>({...p,photo:e.target.value}))}
                    style={adminInput}
                    onFocus={fi} onBlur={fo}
                    placeholder="https://... or emoji like 🎨"
                  />
                </div>
                {/* Preview */}
                {editingChild.photo && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.8rem', background:'#faf9f6', border:`1.5px solid ${C.adBorder}`, borderRadius:'12px', padding:'.8rem 1rem' }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'10px', background:C.adBorder, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                      {isValidUrl(editingChild.photo)
                        ? <img src={getPhotoSrc(editingChild.photo)} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        : <span style={{ fontSize:'1.8rem' }}>{isEmoji(editingChild.photo)?editingChild.photo:'👶'}</span>
                      }
                    </div>
                    <div style={{ fontSize:'.82rem', color:C.adMid }}>Photo preview</div>
                  </div>
                )}
                {/* Actions */}
                <div style={{ display:'flex', gap:'.8rem', marginTop:'.3rem' }}>
                  <button
                    onClick={handleSaveChild}
                    style={{...btnAdmin, flex:1, justifyContent:'center', borderRadius:'12px', boxShadow:'none', padding:'1rem'}}
                  >
                    ✓ Save Changes
                  </button>
                  <button
                    onClick={()=>setEditingChild(null)}
                    style={{...btnO, borderColor:C.adBorder, color:C.adMid, borderRadius:'12px', padding:'1rem 1.4rem'}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {adoptionAction && (
        <Overlay onClose={()=>setAdoptionAction(null)}>
          <div style={{ background:C.white, borderRadius:'22px', padding:'2.5rem 2.8rem', maxWidth:'400px', width:'100%', textAlign:'center', animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'50%', margin:'0 auto 1.2rem', display:'flex', alignItems:'center', justifyContent:'center', background:adoptionAction.action==='approve'?'#eef4ee':'#fff0f0', fontSize:'1.8rem' }}>
              {adoptionAction.action==='approve'?'✓':'✕'}
            </div>
            <h3 style={{ fontSize:'1.5rem', fontWeight:800, color:C.adText, margin:'0 0 .6rem', fontFamily:"'Crimson Pro',Georgia,serif" }}>
              {adoptionAction.action==='approve'?'Approve Application':'Reject Application'}
            </h3>
            <p style={{ color:C.adMid, fontSize:'1rem', margin:'0 0 2rem', lineHeight:1.6, fontFamily:"'Crimson Pro',Georgia,serif" }}>
              Are you sure you want to {adoptionAction.action} this adoption application?
            </p>
            <div style={{ display:'flex', gap:'.8rem', justifyContent:'center' }}>
              <button onClick={()=>setAdoptionAction(null)} style={{...btnO,borderColor:C.adBorder,color:C.adMid,padding:'.75rem 1.6rem',borderRadius:'12px'}}>Cancel</button>
              <button onClick={()=>handleAdoptionStatus(adoptionAction.id, adoptionAction.action)} disabled={actionLoading}
                style={{ ...btnAdmin, padding:'.75rem 1.6rem', background:adoptionAction.action==='approve'?`linear-gradient(135deg,${C.adAccent},#3d6b41)`:'linear-gradient(135deg,#c0392b,#e74c3c)', boxShadow:'none', cursor:actionLoading?'not-allowed':'pointer' }}>
                {actionLoading?'Processing…':adoptionAction.action==='approve'?'✓ Approve':'✕ Reject'}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Sidebar */}
      {(sidebarOpen||!isMobile) && (
        <>
          {isMobile && <div onClick={()=>setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', zIndex:100 }}/>}
          <div style={{ width:`${sW}px`, background:`linear-gradient(180deg,${C.adSide} 0%,${C.adSide2} 100%)`, minHeight:'100vh', position:isMobile?'fixed':'sticky', top:0, left:0, zIndex:101, display:'flex', flexDirection:'column', flexShrink:0, boxShadow:'4px 0 24px rgba(0,0,0,.15)', height:isMobile?'100vh':undefined, overflowY:'auto', animation:isMobile?'slideRight .25s ease':undefined }}>
            <div style={{ padding:'1.6rem 1.4rem 1.2rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Shield size={22} color="white"/></div>
                <div><div style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', lineHeight:1 }}>MakeLife</div><div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.4)', fontWeight:600, marginTop:'.1rem' }}>Admin Panel</div></div>
              </div>
            </div>
            <div style={{ padding:'.9rem 1.4rem', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:'.7rem' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.85rem', flexShrink:0 }}>{(adminUser.name||'A')[0].toUpperCase()}</div>
              <div style={{ overflow:'hidden' }}><div style={{ fontSize:'.88rem', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{adminUser.name}</div><div style={{ fontSize:'.72rem', color:C.adAccent, fontWeight:700 }}>Super Admin</div></div>
            </div>
            <nav style={{ padding:'.8rem .7rem', flex:1 }}>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.08em', padding:'.3rem .7rem .5rem' }}>Main Menu</div>
              {TABS.map(t => {
                const badgeCount = t.alwaysShow ? t.badge : (showBadge(t.id, t.badge) ? t.badge : 0);
                return (
                  <button key={t.id} onClick={()=>goToTab(t.id)}
                    style={{ display:'flex', alignItems:'center', gap:'.8rem', width:'100%', padding:'.8rem .9rem', borderRadius:'12px', border:'none', background:tab===t.id?`rgba(90,138,94,.2)`:'transparent', color:tab===t.id?'#fff':'rgba(255,255,255,.55)', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", fontSize:'.95rem', fontWeight:tab===t.id?700:500, marginBottom:'.2rem', transition:'all .2s', textAlign:'left', borderLeft:tab===t.id?`3px solid ${C.adAccent}`:'3px solid transparent' }}>
                    <span style={{ color:tab===t.id?C.adAccent:'rgba(255,255,255,.4)', display:'flex' }}>{t.icon}</span>
                    {t.label}
                    {badgeCount > 0 && <span style={{ marginLeft:'auto', background:t.badgeAlert?'#c9975a':C.adAccent, color:'#fff', borderRadius:'50px', padding:'.1rem .5rem', fontSize:'.7rem', fontWeight:800, minWidth:'20px', textAlign:'center' }}>{badgeCount}</span>}
                  </button>
                );
              })}
            </nav>
            <div style={{ padding:'.8rem .7rem 1.5rem' }}>
              {lastRefresh && <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.25)', textAlign:'center', marginBottom:'.5rem' }}>Updated {lastRefresh.toLocaleTimeString()}</div>}
              <button onClick={()=>fetchAll(true)} disabled={refreshing} style={{ display:'flex', alignItems:'center', gap:'.6rem', width:'100%', padding:'.7rem .9rem', borderRadius:'10px', border:`1px solid rgba(255,255,255,.1)`, background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.6)', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", fontSize:'.85rem', fontWeight:600, marginBottom:'.5rem' }}>
                <RefreshCw size={15} style={{ animation:refreshing?'spin 1s linear infinite':undefined }}/> {refreshing?'Refreshing…':'Refresh Data'}
              </button>
              <button onClick={()=>{localStorage.removeItem('ml_admin_token');onLogout();}} style={{ display:'flex', alignItems:'center', gap:'.7rem', width:'100%', padding:'.8rem .9rem', borderRadius:'12px', border:'none', background:'rgba(192,57,43,.1)', color:'rgba(255,120,100,.85)', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", fontSize:'.9rem', fontWeight:700 }}>
                <LogOut size={17}/> Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <div style={{ background:'rgba(255,255,255,.9)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.adBorder}`, padding:isMobile?'.9rem 1rem':'1rem 2rem', display:'flex', alignItems:'center', gap:'1rem', position:'sticky', top:0, zIndex:50, boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
          {isMobile && <button onClick={()=>setSidebarOpen(true)} style={{ background:'none', border:`1.5px solid ${C.adBorder}`, borderRadius:'10px', padding:'.4rem .5rem', cursor:'pointer', display:'flex', alignItems:'center', color:C.adMid, flexShrink:0 }}><Menu size={20}/></button>}
          <div style={{ flex:1 }}>
            <h1 style={{ margin:0, fontSize:isMobile?'1.2rem':'1.5rem', fontWeight:800, color:C.adText, letterSpacing:'-.02em' }}>{TABS.find(t=>t.id===tab)?.label}</h1>
            <p style={{ margin:0, fontSize:'.78rem', color:C.adMid, fontWeight:500 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
          </div>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.85rem', flexShrink:0 }}>
            {(adminUser.name||'A')[0].toUpperCase()}
          </div>
        </div>

        <div style={{ padding:isMobile?'1.2rem':'1.8rem 2rem', flex:1 }}>
          {loadingData ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'1rem' }}>
              <div style={{ width:'48px', height:'48px', border:`4px solid ${C.adBorder}`, borderTop:`4px solid ${C.adAccent}`, borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
              <p style={{ color:C.adMid, fontWeight:600 }}>Loading dashboard data…</p>
            </div>
          ) : (
            <>
            {tab==='slideshow' && (
                <div style={{ animation:'fadeIn .4s ease' }}>
                  {/* Header */}
                  <div style={{ background:C.adCard, borderRadius:'20px', padding:'1.8rem 2rem',
                    marginBottom:'1.5rem', border:`1px solid ${C.adBorder}`,
                    boxShadow:`0 2px 16px rgba(0,0,0,.05)` }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between',
                      flexWrap:'wrap', gap:'1rem' }}>
                      <div>
                        <h3 style={{ margin:'0 0 .3rem', fontSize:'1.2rem', fontWeight:800, color:C.adText }}>
                          Homepage Slideshow
                        </h3>
                        <p style={{ margin:0, fontSize:'.88rem', color:C.adMid }}>
                          Photos uploaded here appear on the public homepage slideshow. Only admins can manage these.
                        </p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'.8rem', flexWrap:'wrap' }}>
                        <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.5rem 1rem',
                          fontSize:'.88rem', fontWeight:700, color:C.adAccent }}>
                          {slides.length} photo{slides.length !== 1 ? 's' : ''}
                        </div>
                        <label style={{ ...btnAdmin, padding:'.65rem 1.3rem', fontSize:'.9rem',
                          borderRadius:'10px', boxShadow:'none', cursor: slideUploading ? 'not-allowed' : 'pointer',
                          background: slideUploading ? '#ccc' : `linear-gradient(135deg,${C.adAccent},#3d6b41)`,
                          opacity: slideUploading ? .7 : 1 }}>
                          {slideUploading ? (
                            <><RefreshCw size={15} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</>
                          ) : (
                            <><Plus size={15}/> Add Photos</>
                          )}
                          <input
                            ref={slideInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={slideUploading}
                            style={{ display:'none' }}
                            onChange={e => handleSlideUpload(e.target.files)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Drag & drop upload zone */}
                  <div
                    onClick={() => !slideUploading && slideInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.adAccent; e.currentTarget.style.background = 'rgba(90,138,94,.06)'; }}
                    onDragLeave={e => { e.currentTarget.style.borderColor = C.adBorder; e.currentTarget.style.background = 'transparent'; }}
                    onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.adBorder; e.currentTarget.style.background = 'transparent'; handleSlideUpload(e.dataTransfer.files); }}
                    style={{ border:`2.5px dashed ${C.adBorder}`, borderRadius:'16px', padding:'2.5rem',
                      textAlign:'center', cursor: slideUploading ? 'not-allowed' : 'pointer',
                      marginBottom:'1.5rem', transition:'all .2s' }}>
                    <div style={{ width:'56px', height:'56px', borderRadius:'50%',
                      background:`rgba(90,138,94,.1)`, display:'flex', alignItems:'center',
                      justifyContent:'center', margin:'0 auto .8rem' }}>
                      <Image size={26} color={C.adAccent} />
                    </div>
                    <div style={{ fontSize:'1rem', fontWeight:700, color:C.adText, marginBottom:'.3rem' }}>
                      Click or drag & drop photos here
                    </div>
                    <div style={{ fontSize:'.85rem', color:C.adMid }}>
                      JPG, PNG, WebP supported · Multiple files allowed
                    </div>
                  </div>

                  {/* Photo grid */}
                  {slidesLoading ? (
                    <div style={{ textAlign:'center', padding:'3rem', color:C.adMid }}>
                      <div style={{ width:'40px', height:'40px', border:`3px solid ${C.adBorder}`,
                        borderTop:`3px solid ${C.adAccent}`, borderRadius:'50%',
                        animation:'spin 1s linear infinite', margin:'0 auto 1rem' }}/>
                      Loading slideshow photos…
                    </div>
                  ) : slides.length === 0 ? (
                    <div style={{ background:C.adCard, borderRadius:'16px', padding:'3rem',
                      textAlign:'center', color:C.adMid, border:`1px solid ${C.adBorder}` }}>
                      <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>🖼️</div>
                      <div style={{ fontWeight:700, color:C.adText, marginBottom:'.4rem' }}>No photos yet</div>
                      <div style={{ fontSize:'.88rem' }}>Upload photos above to show them on the homepage slideshow.</div>
                    </div>
                  ) : (
                    <div style={{ display:'grid',
                      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                      gap:'1.2rem' }}>
                      {slides.map((slide, idx) => (
                        <div key={slide._id || idx} style={{ background:C.adCard, borderRadius:'16px',
                          overflow:'hidden', border:`1px solid ${C.adBorder}`,
                          boxShadow:`0 2px 16px rgba(0,0,0,.06)`, position:'relative' }}>
                          <div style={{ height:'200px', background:'#f0ede6', position:'relative', overflow:'hidden' }}>
                            <img src={slide.url} alt={`Slide ${idx + 1}`}
                              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                              onError={e => { e.target.style.display='none'; }}/>
                            {/* Slide number badge */}
                            <div style={{ position:'absolute', top:'.6rem', left:'.6rem',
                              background:'rgba(0,0,0,.55)', borderRadius:'8px',
                              padding:'.2rem .6rem', fontSize:'.75rem', fontWeight:800, color:'#fff' }}>
                              #{idx + 1}
                            </div>
                            {/* Delete button */}
                            <button
                              onClick={() => setSlideDeleteConfirm({ id: slide._id, url: slide.url })}
                              style={{ position:'absolute', top:'.6rem', right:'.6rem',
                                background:'rgba(192,57,43,.88)', border:'none', borderRadius:'8px',
                                width:'32px', height:'32px', display:'flex', alignItems:'center',
                                justifyContent:'center', cursor:'pointer', transition:'background .2s' }}
                              onMouseEnter={e => e.currentTarget.style.background='rgba(192,57,43,1)'}
                              onMouseLeave={e => e.currentTarget.style.background='rgba(192,57,43,.88)'}
                              title="Remove from slideshow">
                              <Trash2 size={14} color="#fff"/>
                            </button>
                          </div>
                          <div style={{ padding:'.75rem 1rem', display:'flex', alignItems:'center',
                            justifyContent:'space-between' }}>
                            <span style={{ fontSize:'.82rem', color:C.adMid, fontWeight:600 }}>
                              Photo {idx + 1}
                            </span>
                            {slide.createdAt && (
                              <span style={{ fontSize:'.75rem', color:C.adMid }}>
                                {new Date(slide.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {tab==='our-story' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    <div style={{ background:C.adCard, borderRadius:'20px', padding:'1.8rem 2rem',
      marginBottom:'1.5rem', border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)` }}>
      <h3 style={{ margin:'0 0 .3rem', fontSize:'1.2rem', fontWeight:800, color:C.adText }}>
        Our Story & Founder
      </h3>
      <p style={{ margin:0, fontSize:'.88rem', color:C.adMid }}>
        Set the founder's photo, name, bio and the three story paragraphs shown on the public homepage.
      </p>
    </div>

    {founderLoading ? (
      <div style={{ textAlign:'center', padding:'3rem', color:C.adMid }}>
        <div style={{ width:'40px', height:'40px', border:`3px solid ${C.adBorder}`,
          borderTop:`3px solid ${C.adAccent}`, borderRadius:'50%',
          animation:'spin 1s linear infinite', margin:'0 auto 1rem' }}/>
        Loading…
      </div>
    ) : (
      <div style={{ display:'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap:'1.5rem' }}>

        {/* LEFT: Founder details */}
        <div style={{ background:C.adCard, borderRadius:'18px', padding:'1.8rem',
          border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)` }}>
          <h4 style={{ margin:'0 0 1.2rem', fontSize:'1rem', fontWeight:800, color:C.adText }}>Founder Details</h4>

          <div style={{ marginBottom:'1.2rem' }}>
            <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.5rem', fontSize:'.9rem' }}>Founder Photo</label>
            {(founderPhotoPreview || founderStory.founderPhoto) && (
              <div style={{ marginBottom:'.8rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                <img
                  src={founderPhotoPreview ||
                    (founderStory.founderPhoto.startsWith('/uploads/')
                      ? `${process.env.REACT_APP_API_URL}${founderStory.founderPhoto}`
                      : founderStory.founderPhoto)}
                  alt="preview"
                  style={{ width:'90px', height:'110px', objectFit:'cover',
                    borderRadius:'12px', border:`2px solid ${C.adBorder}` }}
                  onError={e => e.target.style.display='none'}
                />
                <span style={{ fontSize:'.82rem', color:C.adMid }}>
                  {founderPhotoPreview ? 'New photo selected' : 'Current photo'}
                </span>
              </div>
            )}
            <input type="file" accept=".jpg,.jpeg,.png,.webp"
              style={{ padding:'.8rem', fontSize:'.9rem', border:`1px solid ${C.adBorder}`,
                borderRadius:'12px', cursor:'pointer', background:C.adBg,
                width:'100%', boxSizing:'border-box' }}
              onChange={e => {
                const f = e.target.files[0];
                if (f) { setFounderPhotoFile(f); setFounderPhotoPreview(URL.createObjectURL(f)); }
              }}
            />
          </div>

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Founder Name</label>
            <input type="text" value={founderStory.founderName}
              onChange={e => setFounderStory(p => ({ ...p, founderName: e.target.value }))}
              placeholder="e.g. Dr. Anjali Sharma" style={adminInput} onFocus={fi} onBlur={fo} />
          </div>

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Role / Title</label>
            <input type="text" value={founderStory.founderRole}
              onChange={e => setFounderStory(p => ({ ...p, founderRole: e.target.value }))}
              placeholder="e.g. Founder & Director" style={adminInput} onFocus={fi} onBlur={fo} />
          </div>

          <div>
            <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Founder Biography</label>
            <textarea rows="5" value={founderStory.founderBio}
              onChange={e => setFounderStory(p => ({ ...p, founderBio: e.target.value }))}
              placeholder="A short bio about the founder…"
              style={{ ...adminInput, resize:'vertical' }} onFocus={fi} onBlur={fo} />
          </div>
        </div>

        {/* RIGHT: Story paragraphs */}
        <div style={{ background:C.adCard, borderRadius:'18px', padding:'1.8rem',
          border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)` }}>
          <h4 style={{ margin:'0 0 .5rem', fontSize:'1rem', fontWeight:800, color:C.adText }}>Story Paragraphs</h4>
          <p style={{ margin:'0 0 1.2rem', fontSize:'.83rem', color:C.adMid }}>
            These appear below the founder section on the homepage.
          </p>
          {['story1','story2','story3'].map((key, i) => (
            <div key={key} style={{ marginBottom: i < 2 ? '1.1rem' : 0 }}>
              <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>
                Paragraph {i + 1}
              </label>
              <textarea rows="4" value={founderStory[key]}
                onChange={e => setFounderStory(p => ({ ...p, [key]: e.target.value }))}
                placeholder={i===0?'Founded in 2025…':i===1?'Our mission is…':'Through dedicated staff…'}
                style={{ ...adminInput, resize:'vertical' }} onFocus={fi} onBlur={fo} />
            </div>
          ))}
        </div>
      </div>
    )}

    {!founderLoading && (
      <div style={{ marginTop:'1.5rem', display:'flex', justifyContent:'flex-end' }}>
        <button disabled={founderSaving} onClick={async () => {
          setFounderSaving(true);
          try {
            let photoUrl = founderStory.founderPhoto;
            if (founderPhotoFile) {
              const token = localStorage.getItem('ml_admin_token') || localStorage.getItem('ml_token');
              const fd = new FormData();
              fd.append('photo', founderPhotoFile);
              try {
                const ur = await fetch(`${API}/upload`, { method:'POST', body:fd, headers: token?{Authorization:`Bearer ${token}`}:{} });
                if (ur.ok) { const res = await ur.json(); photoUrl = res.url || res.path || res.filename || photoUrl; }
              } catch {}
              setFounderPhotoFile(null); setFounderPhotoPreview('');
            }
            const payload = { ...founderStory, founderPhoto: photoUrl };
            try { await adminFetch(`${process.env.REACT_APP_API_URL}/founder-story`, { method:'POST', body:JSON.stringify(payload) }); } catch {}
            try { localStorage.setItem('ml_founder_story', JSON.stringify(payload)); } catch {}
            setFounderStory(payload);
            showToast('Our Story section saved successfully.');
          } catch(err) { showToast(err.message||'Failed to save.','error'); }
          finally { setFounderSaving(false); }
        }}
          style={{ ...btnAdmin, padding:'1rem 2.5rem', borderRadius:'14px', boxShadow:'none',
            background: founderSaving?'#ccc':`linear-gradient(135deg,${C.adAccent},#3d6b41)`,
            cursor: founderSaving?'not-allowed':'pointer' }}>
          {founderSaving ? <><RefreshCw size={16} style={{animation:'spin 1s linear infinite'}}/> Saving…</> : '✓ Save Story'}
        </button>
      </div>
    )}
  </div>
)}
             {tab==='overview' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    {/* ── KPI stat cards ── */}
    <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':isTablet?'repeat(2,1fr)':'repeat(4,1fr)', gap:isMobile?'.9rem':'1.2rem', marginBottom:'1.4rem' }}>
      {stats.map((s,i)=>(
        <div key={i} onClick={()=>goToTab(s.tabTarget)}
          style={{ background:C.adCard, borderRadius:'18px', padding:isMobile?'1.1rem':'1.4rem', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}`, cursor:'pointer', transition:'all .2s' }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.1)`;e.currentTarget.style.transform='translateY(-2px)';}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 2px 16px rgba(0,0,0,.05)`;e.currentTarget.style.transform='translateY(0)';}}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'.8rem' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, flexShrink:0 }}>{s.icon}</div>
            <ChevronRight size={14} style={{ color:C.adMid, opacity:.5, marginTop:'.25rem' }}/>
          </div>
          <div style={{ fontSize:isMobile?'1.6rem':'2rem', fontWeight:800, color:C.adText, letterSpacing:'-.02em', lineHeight:1, marginBottom:'.3rem' }}>{s.value}</div>
          <div style={{ fontSize:'.82rem', color:C.adMid, fontWeight:600, marginBottom:'.2rem' }}>{s.label}</div>
          <div style={{ fontSize:'.75rem', color:s.color, fontWeight:700 }}>{s.trend}</div>
        </div>
      ))}
    </div>

    {/* ── Action required banner ── */}
    {(pendingAdoptions>0||unreadContacts>0) && (
      <div style={{ background:'linear-gradient(135deg,#fdf9f0,#fef6e8)', border:`2px solid rgba(201,151,90,.25)`, borderRadius:'16px', padding:'1.2rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', marginBottom:'1.4rem' }}>
        <AlertCircle size={20} color={C.adGold}/>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, color:C.adText, fontSize:'.95rem' }}>Action Required</div>
          <div style={{ fontSize:'.85rem', color:C.adMid }}>
            {pendingAdoptions>0 && <span>{pendingAdoptions} adoption application{pendingAdoptions>1?'s':''} awaiting review. </span>}
            {unreadContacts>0 && <span>{unreadContacts} unread message{unreadContacts>1?'s':''} in your inbox.</span>}
          </div>
        </div>
        <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
          {pendingAdoptions>0 && <button onClick={()=>goToTab('adoptions')} style={{...btnAdmin,padding:'.55rem 1.1rem',fontSize:'.85rem',borderRadius:'10px',boxShadow:'none'}}>Review Adoptions</button>}
          {unreadContacts>0 && <button onClick={()=>goToTab('contacts')} style={{...btnAdmin,padding:'.55rem 1.1rem',fontSize:'.85rem',borderRadius:'10px',background:`linear-gradient(135deg,#9a5a7a,#7d3d5f)`,boxShadow:'none'}}>View Messages</button>}
        </div>
      </div>
    )}

    {/* ── All sections grid ── */}
    <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)', gap:'1.2rem' }}>

      {/* Slideshow */}
      <div onClick={()=>goToTab('slideshow')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#eef4ee', display:'flex', alignItems:'center', justifyContent:'center' }}><Image size={18} color={C.adAccent}/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Slideshow</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:C.adAccent, marginBottom:'.2rem' }}>{slides.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Homepage photos</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', fontSize:'.8rem', color:C.adAccent, fontWeight:700 }}>
          {slides.length===0 ? 'No photos yet — upload to begin' : `${slides.length} photo${slides.length>1?'s':''} live on homepage`}
        </div>
      </div>

      {/* Our Story */}
      <div onClick={()=>goToTab('our-story')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#f0eafb', display:'flex', alignItems:'center', justifyContent:'center' }}><BookOpen size={18} color='#7a3ab5'/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Our Story</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:'#7a3ab5', marginBottom:'.2rem' }}>
          {founderStory.founderName ? '✓' : '—'}
        </div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Founder & story section</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', fontSize:'.8rem', color:'#7a3ab5', fontWeight:700 }}>
          {founderStory.founderName ? `Set — ${founderStory.founderName}` : 'Not configured yet'}
        </div>
      </div>

      {/* Children */}
      <div onClick={()=>goToTab('children')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#eef4ee', display:'flex', alignItems:'center', justifyContent:'center' }}><Users size={18} color={C.adAccent}/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Children</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:C.adAccent, marginBottom:'.2rem' }}>{children.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Active profiles</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          {[['Boys', children.filter(c=>{ const g=(c.gender||'').toLowerCase(); return g==='boy'||g==='male'; }).length, '#3a7abd'],
            ['Girls', children.filter(c=>{ const g=(c.gender||'').toLowerCase(); return g==='girl'||g==='female'; }).length, '#c2185b']
          ].map(([lbl,cnt,col])=>(
            <span key={lbl} style={{ fontSize:'.78rem', fontWeight:700, color:col, background:col==='#3a7abd'?'#e3f2fd':'#fce4ec', borderRadius:'50px', padding:'.15rem .65rem' }}>{cnt} {lbl}</span>
          ))}
          <span style={{ fontSize:'.78rem', fontWeight:700, color:C.adAccent, background:'#eef4ee', borderRadius:'50px', padding:'.15rem .65rem' }}>
            {children.filter(c=>{ const g=(c.gender||'').toLowerCase(); return g!=='boy'&&g!=='male'&&g!=='girl'&&g!=='female'&&g!==''; }).length} Other
          </span>
        </div>
      </div>

      {/* Members */}
      <div onClick={()=>goToTab('members')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#fdf3e8', display:'flex', alignItems:'center', justifyContent:'center' }}><UserCheck size={18} color={C.adGold}/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Members</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:C.adGold, marginBottom:'.2rem' }}>{adminMembers.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Team members</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', fontSize:'.8rem', color:C.adGold, fontWeight:700 }}>
          {adminMembers.length===0 ? 'No members added yet' : `${adminMembers.length} member${adminMembers.length>1?'s':''} on the team`}
        </div>
      </div>

      {/* Money Donations */}
      <div onClick={()=>goToTab('donations')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#eef6ee', display:'flex', alignItems:'center', justifyContent:'center' }}><DollarSign size={18} color='#2a7d4f'/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Money Donations</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'1.7rem', fontWeight:800, color:'#2a7d4f', marginBottom:'.2rem' }}>₹{fmt(totalRaised)}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Total raised</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', fontSize:'.8rem', color:'#2a7d4f', fontWeight:700 }}>
          {donations.length} donor{donations.length!==1?'s':''} · avg ₹{donations.length>0?fmt(totalRaised/donations.length):'0'} per donation
        </div>
      </div>

      {/* Goods Donations */}
      <div onClick={()=>goToTab('goods-donations')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s', position:'relative' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        {goodsDonations.filter(g=>!g.status||g.status==='pending').length>0 && (
          <div style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'#c9975a', color:'#fff', borderRadius:'50px', padding:'.1rem .55rem', fontSize:'.72rem', fontWeight:800 }}>
            {goodsDonations.filter(g=>!g.status||g.status==='pending').length} pending
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#fff8f0', display:'flex', alignItems:'center', justifyContent:'center' }}><Gift size={18} color={C.adGold}/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Goods Donations</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:C.adGold, marginBottom:'.2rem' }}>{goodsDonations.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Total requests</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          {[['Pending', goodsDonations.filter(g=>!g.status||g.status==='pending').length, '#c9975a', '#fff8f0'],
            ['Approved', goodsDonations.filter(g=>g.status==='approved').length, C.adAccent, '#eef4ee'],
            ['Rejected', goodsDonations.filter(g=>g.status==='rejected').length, '#c0392b', '#fff0f0']
          ].map(([lbl,cnt,col,bg])=>(
            <span key={lbl} style={{ fontSize:'.78rem', fontWeight:700, color:col, background:bg, borderRadius:'50px', padding:'.15rem .65rem' }}>{cnt} {lbl}</span>
          ))}
        </div>
      </div>

      {/* Adoptions */}
      <div onClick={()=>goToTab('adoptions')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s', position:'relative' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        {pendingAdoptions>0 && (
          <div style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'#c9975a', color:'#fff', borderRadius:'50px', padding:'.1rem .55rem', fontSize:'.72rem', fontWeight:800 }}>
            {pendingAdoptions} pending
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#eaf0f6', display:'flex', alignItems:'center', justifyContent:'center' }}><UserCheck size={18} color='#5a7a9a'/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Adoptions</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:'#5a7a9a', marginBottom:'.2rem' }}>{adoptions.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Total applications</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          {[['Pending', adoptions.filter(a=>!a.status||a.status==='pending').length, '#c9975a', '#fff8f0'],
            ['Approved', adoptions.filter(a=>a.status==='approved').length, '#2a7d4f', '#eef4ee'],
            ['Rejected', adoptions.filter(a=>a.status==='rejected').length, '#c0392b', '#fff0f0']
          ].map(([lbl,cnt,col,bg])=>(
            <span key={lbl} style={{ fontSize:'.78rem', fontWeight:700, color:col, background:bg, borderRadius:'50px', padding:'.15rem .65rem' }}>{cnt} {lbl}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div onClick={()=>goToTab('contacts')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s', position:'relative' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        {unreadContacts>0 && (
          <div style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'#9a5a7a', color:'#fff', borderRadius:'50px', padding:'.1rem .55rem', fontSize:'.72rem', fontWeight:800 }}>
            {unreadContacts} unread
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#f6eaf0', display:'flex', alignItems:'center', justifyContent:'center' }}><Inbox size={18} color='#9a5a7a'/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Messages</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:'#9a5a7a', marginBottom:'.2rem' }}>{contacts.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Total messages</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'.78rem', fontWeight:700, color:'#9a5a7a', background:'#f6eaf0', borderRadius:'50px', padding:'.15rem .65rem' }}>{unreadContacts} Unread</span>
          <span style={{ fontSize:'.78rem', fontWeight:700, color:C.adAccent, background:'#eef4ee', borderRadius:'50px', padding:'.15rem .65rem' }}>{contacts.filter(c=>c.replied).length} Replied</span>
        </div>
      </div>

      {/* Volunteers */}
    <div onClick={()=>goToTab('vol-requests')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s', position:'relative' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        {volunteers.filter(v=>v.status==='pending').length>0 && (
          <div style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'#c07c2a', color:'#fff', borderRadius:'50px', padding:'.1rem .55rem', fontSize:'.72rem', fontWeight:800 }}>
            {volunteers.filter(v=>v.status==='pending').length} pending
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#fff8f0', display:'flex', alignItems:'center', justifyContent:'center' }}><HandHeart size={18} color='#c07c2a'/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Volunteers</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:'#c07c2a', marginBottom:'.2rem' }}>{volunteers.length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Total applications</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          {[['Pending', volunteers.filter(v=>v.status==='pending').length, '#c07c2a', '#fff8f0'],
            ['Approved', volunteers.filter(v=>v.status==='approved').length, '#2a7d4f', '#eef4ee'],
            ['Rejected', volunteers.filter(v=>v.status==='rejected').length, '#c0392b', '#fff0f0']
          ].map(([lbl,cnt,col,bg])=>(
            <span key={lbl} style={{ fontSize:'.78rem', fontWeight:700, color:col, background:bg, borderRadius:'50px', padding:'.15rem .65rem' }}>{cnt} {lbl}</span>
          ))}
        </div>
      </div>
{/* Volunteer Profiles */}
      <div onClick={()=>goToTab('vol-profiles')} style={{ background:C.adCard, borderRadius:'16px', border:`1px solid ${C.adBorder}`, padding:'1.4rem', cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.09)`;e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#eef4ee', display:'flex', alignItems:'center', justifyContent:'center' }}><Users size={18} color={C.adAccent}/></div>
            <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>Volunteer Profiles</div>
          </div>
          <ChevronRight size={15} color={C.adMid}/>
        </div>
        <div style={{ fontSize:'2rem', fontWeight:800, color:C.adAccent, marginBottom:'.2rem' }}>{volunteers.filter(v=>v.status==='approved').length}</div>
        <div style={{ fontSize:'.82rem', color:C.adMid }}>Approved volunteers</div>
        <div style={{ marginTop:'.9rem', borderTop:`1px solid ${C.adBorder}`, paddingTop:'.8rem', fontSize:'.8rem', color:C.adAccent, fontWeight:700 }}>
          {volunteers.filter(v=>v.status==='approved').length===0 ? 'No approved volunteers yet' : `${volunteers.filter(v=>v.status==='approved').length} active volunteer profile${volunteers.filter(v=>v.status==='approved').length>1?'s':''}`}
        </div>
      </div>
    </div>
  </div>
)}

              {tab==='children' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem', flexWrap:'wrap', gap:'.8rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.8rem', flex:1, flexWrap:'wrap' }}>
        <p style={{ margin:0, fontSize:'.9rem', color:C.adMid, fontWeight:600 }}>{children.length} total profiles</p>
        <div style={{ position:'relative' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
          <input type="text" placeholder="Search by name, age…" value={searchChildren}
            onChange={e => setSearchChildren(e.target.value)}
            style={searchBarStyle}
            onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
          />
        </div>
      </div>
      <button onClick={()=>setShowAddForm(!showAddForm)} style={{...btnAdmin,padding:'.65rem 1.2rem',fontSize:'.9rem',borderRadius:'10px',boxShadow:'none'}}><Plus size={16}/> Add Child</button>
    </div>
                  {showAddForm && (
                    <div style={{ background:C.adCard, padding:'2rem', borderRadius:'16px', boxShadow:`0 4px 20px rgba(0,0,0,.08)`, border:`1px solid ${C.adBorder}`, marginBottom:'1.5rem', position:'relative' }}>
                      <button type="button" onClick={()=>setShowAddForm(false)} style={{ position:'absolute', top:'1rem', right:'1rem', width:'32px', height:'32px', borderRadius:'50%', border:`1px solid ${C.adBorder}`, background:C.adBg, color:C.adMid, fontSize:'.9rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                      <h3 style={{ fontSize:'1.1rem', fontWeight:800, marginBottom:'1.2rem', color:C.adText }}>Add New Child Profile</h3>
                      <form onSubmit={handleAddChild} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr', gap:'1rem' }}>
                          <input type="text" name="name" placeholder="Child's Name" required style={adminInput} onFocus={fi} onBlur={fo}/>
                          <input type="number" name="age" placeholder="Age" required min="1" max="18" style={adminInput} onFocus={fi} onBlur={fo}/>
                          <div style={{ position:'relative' }}><select name="gender" required defaultValue="" style={{...adminInput,paddingRight:'2.5rem',cursor:'pointer'}} onFocus={fi} onBlur={fo}><option value="" disabled>Gender</option><option value="Boy">Boy</option><option value="Girl">Girl</option></select></div>
                        </div>
                        <div>
                          <label style={{ fontSize:'.88rem', color:C.adMid, fontWeight:700, display:'block', marginBottom:'.4rem' }}>Child's Photo</label>
                          <input type="file" name="photo" accept=".jpg,.jpeg,.png" required style={{ padding:'.8rem', fontSize:'.9rem', border:`1px solid ${C.adBorder}`, borderRadius:'12px', cursor:'pointer', background:C.adBg, width:'100%', boxSizing:'border-box' }} onChange={e=>{const f=e.target.files[0];if(f){const pv=document.getElementById('admin-photo-preview');if(pv){pv.src=URL.createObjectURL(f);pv.style.display='block';}}}}/>
                          <div style={{ display:'flex', justifyContent:'center', marginTop:'.5rem' }}><img id="admin-photo-preview" alt="preview" style={{ display:'none', width:'100px', height:'100px', objectFit:'contain', borderRadius:'12px', border:`2px solid ${C.adBorder}` }}/></div>
                        </div>
                        <textarea name="story" placeholder="Child's Story" required rows="3" style={{...adminInput,resize:'vertical'}} onFocus={fi} onBlur={fo}/>
                        <div style={{ display:'flex', gap:'.8rem' }}>
                          <button type="submit" style={{...btnAdmin,flex:1,justifyContent:'center',boxShadow:'none'}}>Add Child Profile</button>
                          <button type="button" onClick={()=>setShowAddForm(false)} style={{ ...btnO, borderColor:C.adBorder, color:C.adMid, borderRadius:'12px', padding:'.75rem 1.4rem' }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}
                  <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)', gap:'1.2rem' }}>
                    {children.filter(c => {
                      const q = searchChildren.toLowerCase();
                      if (!q) return true;
                      return (c.name||'').toLowerCase().includes(q) ||
                             String(c.age).includes(q) ||
                             (c.gender||'').toLowerCase().includes(q) ||
                             (c.story||'').toLowerCase().includes(q);
                    }).map(child=>(
                      <div key={child._id} style={{ background:C.adCard, borderRadius:'16px', overflow:'hidden', boxShadow:`0 2px 16px rgba(0,0,0,.06)`, border:`1px solid ${C.adBorder}` }}>
                        {/* Photo area with delete button */}
                       <div style={{ height:'320px', background:'linear-gradient(135deg,#f0ede6,#e8e3dc)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', borderRadius:'16px 16px 0 0' }}>
  {isValidUrl(child.photo)
    ? <img src={getPhotoSrc(child.photo)} alt={child.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 15%', display:'block', padding:'0' }}/>
    : <span style={{ fontSize:'4rem' }}>{isEmoji(child.photo) ? child.photo : '👶'}</span>
  }
  <button onClick={()=>handleDeleteChild(child._id, child.name)} style={{ position:'absolute', top:'.6rem', left:'.6rem', background:'rgba(255,255,255,.95)', border:`1px solid #f5c6cb`, borderRadius:'8px', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} title="Delete child">
    <Trash2 size={13} color="#c0392b"/>
  </button>
</div>
                        {/* Card body */}
                        <div style={{ padding:'1rem 1.1rem' }}>
                          <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem', marginBottom:'.2rem' }}>{child.name}</div>
                          <div style={{ fontSize:'.8rem', color:C.adMid, marginBottom:'.5rem' }}>Age {child.age} · {child.gender||'—'}</div>
                          <p style={{ fontSize:'.82rem', color:C.adMid, margin:'0 0 .8rem', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{child.story}</p>
                          {/* ── NEW: Edit button ── */}
                          <button
                            onClick={()=>setEditingChild({...child})}
                            style={{
                              width:'100%',
                              background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`,
                              color:'#fff', border:'none', borderRadius:'10px',
                              padding:'.6rem', fontSize:'.85rem', fontWeight:700,
                              cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif",
                              display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem',
                              transition:'opacity .2s',
                            }}
                            onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
                            onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                          >
                            Edit Details
                          </button>
                        </div>
                      </div>
                    ))}
                   {children.filter(c => { const q=searchChildren.toLowerCase(); if(!q)return true; return (c.name||'').toLowerCase().includes(q)||String(c.age).includes(q)||(c.gender||'').toLowerCase().includes(q); }).length===0 && <div style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:C.adMid}}>No children match your search</div>}
                  </div>
                </div>
              )}

         {tab==='donations' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    <div style={{ background:C.adCard, borderRadius:'18px', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}`, overflow:'hidden' }}>
      <div style={{ padding:'1.2rem 1.5rem', borderBottom:`1px solid ${C.adBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.8rem' }}>
        <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:C.adText }}>All Donations ({donations.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:'.8rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
            <input
              type="text"
              placeholder="Search by name, email, phone…"
              value={searchDonations}
              onChange={e => setSearchDonations(e.target.value)}
              style={searchBarStyle}
              onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
            />
          </div>
          <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.5rem 1rem', fontSize:'.9rem', fontWeight:800, color:'#2a7d4f' }}>Total: ₹{fmt(totalRaised)}</div>
        </div>
      </div>
      {donations.length===0 ? <div style={{ padding:'3rem', textAlign:'center', color:C.adMid }}>No donations recorded yet</div> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.88rem' }}>
            <thead>
              <tr style={{ background:'#faf9f6' }}>
                {['#','Donor Name','Email','Phone','Amount','For Child','Date'].map(h=>(
                  <th key={h} style={{ padding:'.8rem 1.2rem', textAlign:'left', fontWeight:700, color:C.adMid, fontSize:'.75rem', textTransform:'uppercase', letterSpacing:'.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...donations]
  .filter(d => {
    const q = searchDonations.toLowerCase();
    if (!q) return true;
    return (d.donorName||'').toLowerCase().includes(q) ||
           (d.donorEmail||'').toLowerCase().includes(q) ||
           (d.donorPhone||'').toLowerCase().includes(q) ||
           (d.childName||'').toLowerCase().includes(q) ||
           String(d.amount).includes(q);
  })
  .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((d,i)=>(
                <tr key={d._id||i} style={{ borderTop:`1px solid ${C.adBorder}` }}
                  onMouseEnter={e=>e.currentTarget.style.background='#faf9f6'}
                  onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                  <td style={{ padding:'.7rem 1.2rem', color:C.adMid, fontWeight:600 }}>{i+1}</td>
                  <td style={{ padding:'.7rem 1.2rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                      <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:`linear-gradient(135deg,${C.adGold},#b8843d)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.72rem', flexShrink:0 }}>
                        {(d.donorName||'A')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight:700, color:C.adText, textTransform:'capitalize' }}>{d.donorName||'Anonymous'}</span>
                    </div>
                  </td>
                  <td style={{ padding:'.7rem 1.2rem', color:C.adMid, fontSize:'.82rem' }}>
                    {d.donorEmail ? (
                      <a href={`mailto:${d.donorEmail}`} style={{ color:C.adAccent, textDecoration:'none', fontWeight:600 }}>{d.donorEmail}</a>
                    ) : <span style={{ fontStyle:'italic', opacity:.5 }}>—</span>}
                  </td>
                  <td style={{ padding:'.7rem 1.2rem', color:C.adMid, fontSize:'.82rem' }}>
                    {d.donorPhone ? (
                      <span style={{ display:'flex', alignItems:'center', gap:'.3rem' }}>
                        <Phone size={12} color={C.adAccent}/>{d.donorPhone}
                      </span>
                    ) : <span style={{ fontStyle:'italic', opacity:.5 }}>—</span>}
                  </td>
                  <td style={{ padding:'.7rem 1.2rem', fontWeight:800, color:'#2a7d4f' }}>₹{fmt(d.amount)}</td>
                  <td style={{ padding:'.7rem 1.2rem', color:C.adMid }}>
                    {d.childName ? (
                      <span style={{ background:'#eef4ee', borderRadius:'50px', padding:'.15rem .7rem', fontSize:'.78rem', fontWeight:700, color:C.adAccent }}>{d.childName}</span>
                    ) : <span style={{ fontStyle:'italic', opacity:.6 }}>General</span>}
                  </td>
                  <td style={{ padding:'.7rem 1.2rem', color:C.adMid, whiteSpace:'nowrap' }}>
                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
 

              {tab==='adoptions' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    {/* Search bar */}
    <div style={{ marginBottom:'1.2rem' }}>
      <div style={{ position:'relative', maxWidth:'360px' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
        <input type="text" placeholder="Search by applicant, child name…" value={searchAdoptions}
          onChange={e => setSearchAdoptions(e.target.value)}
          style={searchBarStyle}
          onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
          onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
        />
      </div>
    </div>
    <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
      {adoptions.filter(a => {
        const q = searchAdoptions.toLowerCase();
        if (!q) return true;
        return (a.applicantName||'').toLowerCase().includes(q) ||
               (a.childName||'').toLowerCase().includes(q) ||
               (a.email||'').toLowerCase().includes(q) ||
               (a.status||'').toLowerCase().includes(q);
      }).length===0 ? (
        <div style={{ background:C.adCard, borderRadius:'18px', padding:'3rem', textAlign:'center', color:C.adMid, boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}` }}>
          No adoption applications yet
        </div>
      ) : [...adoptions]
          .filter(a => {
            const q = searchAdoptions.toLowerCase();
            if (!q) return true;
            return (a.applicantName||'').toLowerCase().includes(q) ||
                   (a.childName||'').toLowerCase().includes(q) ||
                   (a.email||'').toLowerCase().includes(q) ||
                   (a.status||'').toLowerCase().includes(q);
          })
          .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((a,i)=>(
        <div key={a._id||i} style={{ background:C.adCard, borderRadius:'16px', overflow:'hidden', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`2px solid ${!a.status||a.status==='pending'?`rgba(201,151,90,.3)`:a.status==='approved'?`rgba(90,138,94,.3)`:`rgba(192,57,43,.2)`}` }}>
          {/* Card header */}
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:`1px solid ${C.adBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.8rem', background:'#fafaf8' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:`linear-gradient(135deg,#5a7a9a,#3d5a7a)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.95rem', flexShrink:0 }}>
                {(a.applicantName||'?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>{a.applicantName}</div>
                <div style={{ fontSize:'.8rem', color:C.adMid, marginTop:'.1rem' }}>
                  Applying for: <strong style={{ color:C.adAccent }}>{a.childName}</strong>
                  {a.createdAt && <span style={{ marginLeft:'.6rem', opacity:.6 }}>· {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>}
                </div>
              </div>
            </div>
            <span style={{ padding:'.3rem .9rem', borderRadius:'50px', fontSize:'.75rem', fontWeight:800, flexShrink:0, background:!a.status||a.status==='pending'?'#fdf3e8':a.status==='approved'?'#eef4ee':'#fff0f0', color:!a.status||a.status==='pending'?C.adGold:a.status==='approved'?C.adAccent:'#c0392b' }}>
              {(a.status||'PENDING').toUpperCase()}
            </span>
          </div>
 
          {/* Details grid */}
          <div style={{ padding:'1.2rem 1.4rem' }}>
            <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)', gap:'1rem', marginBottom:'1rem' }}>
 
              {/* Contact info */}
              {a.email && (
                <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.75rem 1rem', border:`1px solid ${C.adBorder}` }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Email</div>
                  <a href={`mailto:${a.email}`} style={{ fontSize:'.88rem', fontWeight:700, color:C.adAccent, textDecoration:'none', display:'flex', alignItems:'center', gap:'.4rem' }}>
                    <Mail size={13}/>{a.email}
                  </a>
                </div>
              )}
              {a.phone && (
                <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.75rem 1rem', border:`1px solid ${C.adBorder}` }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Phone</div>
                  <div style={{ fontSize:'.88rem', fontWeight:700, color:C.adText, display:'flex', alignItems:'center', gap:'.4rem' }}>
                    <Phone size={13} color={C.adAccent}/>{a.phone}
                  </div>
                </div>
              )}
              {a.annualIncome && (
                <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.75rem 1rem', border:`1px solid ${C.adBorder}` }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Annual Income</div>
                  <div style={{ fontSize:'.95rem', fontWeight:800, color:'#2a7d4f' }}>₹{fmt(a.annualIncome)}</div>
                </div>
              )}
              {a.familyMembers && (
                <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.75rem 1rem', border:`1px solid ${C.adBorder}` }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Family Members</div>
                  <div style={{ fontSize:'.95rem', fontWeight:800, color:C.adText, display:'flex', alignItems:'center', gap:'.4rem' }}>
                    <Users size={14} color={C.adAccent}/>{a.familyMembers} members
                  </div>
                </div>
              )}
            </div>
 
            {/* Address */}
            {a.address && (
              <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.75rem 1rem', border:`1px solid ${C.adBorder}`, marginBottom:'1rem' }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Home Address</div>
                <div style={{ fontSize:'.88rem', color:C.adText, lineHeight:1.5, display:'flex', alignItems:'flex-start', gap:'.4rem' }}>
                  <MapPin size={13} color={C.adAccent} style={{ marginTop:'.15rem', flexShrink:0 }}/>{a.address}
                </div>
              </div>
            )}
 
            {/* Reason */}
            {a.reason && (
              <div style={{ background:'linear-gradient(135deg,#fafaf8,#f5f2ec)', borderRadius:'10px', padding:'.85rem 1rem', border:`1px solid ${C.adBorder}`, marginBottom:'1rem' }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>Reason for Adoption</div>
                <p style={{ fontSize:'.9rem', color:C.adText, margin:0, lineHeight:1.7, fontStyle:'italic' }}>"{a.reason}"</p>
              </div>
            )}
 
            {/* Actions */}
            {(!a.status||a.status==='pending') && (
              <div style={{ display:'flex', gap:'.6rem' }}>
                <button onClick={()=>setAdoptionAction({id:a._id,action:'approve'})}
                  style={{ flex:1, padding:'.7rem', borderRadius:'10px', background:'#eef4ee', border:`1.5px solid rgba(90,138,94,.3)`, color:C.adAccent, fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                  <CheckCircle size={15}/> Approve
                </button>
                <button onClick={()=>setAdoptionAction({id:a._id,action:'reject'})}
                  style={{ flex:1, padding:'.7rem', borderRadius:'10px', background:'#fff0f0', border:`1.5px solid #f5c6cb`, color:'#c0392b', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                  <X size={15}/> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


              {tab==='contacts' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    {/* Search bar */}
    <div style={{ marginBottom:'1.2rem' }}>
      <div style={{ position:'relative', maxWidth:'360px' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
        <input type="text" placeholder="Search by name, email, message…" value={searchContacts}
          onChange={e => setSearchContacts(e.target.value)}
          style={searchBarStyle}
          onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
          onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
        />
      </div>
    </div>
    {contacts.length===0 ? (
      <div style={{ background:C.adCard, borderRadius:'18px', padding:'3rem', textAlign:'center', color:C.adMid, boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}` }}>No messages yet</div>
    ) : (
      <div style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
        {[...contacts]
          .filter(c => {
            const q = searchContacts.toLowerCase();
            if (!q) return true;
            return (c.name||'').toLowerCase().includes(q) ||
                   (c.email||'').toLowerCase().includes(q) ||
                   (c.phone||'').toLowerCase().includes(q) ||
                   (c.message||'').toLowerCase().includes(q);
          })
          .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((c,i)=>(
          <div key={c._id||i} style={{ background:C.adCard, borderRadius:'14px', overflow:'hidden', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`2px solid ${!c.replied?`rgba(154,90,122,.25)`:C.adBorder}` }}>
            {/* Header */}
            <div style={{ padding:'1rem 1.4rem', background:'#fafaf8', borderBottom:`1px solid ${C.adBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`linear-gradient(135deg,#9a5a7a,#7d3d5f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.85rem', flexShrink:0 }}>
                  {(c.name||'?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:800, color:C.adText, fontSize:'.95rem' }}>{c.name||'Unknown'}</div>
                  <div style={{ fontSize:'.78rem', color:C.adMid, marginTop:'.1rem' }}>
                    {c.createdAt && new Date(c.createdAt).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                  </div>
                </div>
              </div>
              {!c.replied
                ? <span style={{ background:'#f6eaf0', border:'1.5px solid rgba(154,90,122,.25)', borderRadius:'50px', padding:'.2rem .7rem', fontSize:'.72rem', fontWeight:800, color:'#9a5a7a', flexShrink:0 }}>UNREAD</span>
                : <span style={{ background:'#eef4ee', border:`1.5px solid rgba(90,138,94,.25)`, borderRadius:'50px', padding:'.2rem .7rem', fontSize:'.72rem', fontWeight:800, color:C.adAccent, flexShrink:0 }}>REPLIED</span>
              }
            </div>
 
            {/* Contact details row */}
            <div style={{ padding:'.75rem 1.4rem', borderBottom:`1px solid ${C.adBorder}`, display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
              {c.email && (
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem' }}>
                  <Mail size={13} color={C.adAccent}/>
                  <a href={`mailto:${c.email}`} style={{ color:C.adAccent, textDecoration:'none', fontWeight:700 }}>{c.email}</a>
                </div>
              )}
              {c.phone && (
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem' }}>
                  <Phone size={13} color={C.adAccent}/>
                  <span style={{ color:C.adText, fontWeight:700 }}>{c.phone}</span>
                </div>
              )}
            </div>
 
            {/* Message body */}
            <div style={{ padding:'1rem 1.4rem' }}>
              <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.5rem' }}>Message</div>
              <p style={{ fontSize:'.92rem', color:C.adText, margin:'0 0 .9rem', lineHeight:1.7, background:'#faf9f6', borderRadius:'10px', padding:'.85rem 1rem', border:`1px solid ${C.adBorder}` }}>
                {c.message}
              </p>
              {!c.replied && (
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem', flexWrap:'wrap' }}>
                  <a href={`mailto:${c.email}`}
                    style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, color:'#fff', fontWeight:700, fontSize:'.82rem', borderRadius:'8px', padding:'.55rem 1rem', textDecoration:'none', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                    <Mail size={13}/> Reply via Email
                  </a>
                  <button onClick={()=>markReplied(c._id)}
                    style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'transparent', border:`1.5px solid rgba(90,138,94,.35)`, color:C.adAccent, fontWeight:700, fontSize:'.82rem', borderRadius:'8px', padding:'.55rem 1rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                    <CheckCircle size={13}/> Mark as Replied
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

              {tab==='members' && (
  <div style={{animation:'fadeIn .4s ease'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.2rem',flexWrap:'wrap',gap:'.8rem'}}>
      <div style={{ display:'flex', alignItems:'center', gap:'.8rem', flex:1, flexWrap:'wrap' }}>
        <p style={{margin:0,fontSize:'.9rem',color:C.adMid,fontWeight:600}}>{adminMembers.length} total members</p>
        <div style={{ position:'relative' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
          <input type="text" placeholder="Search by name, role…" value={searchMembers}
            onChange={e => setSearchMembers(e.target.value)}
            style={searchBarStyle}
            onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
          />
        </div>
      </div>
      <button onClick={()=>setShowAddMemberForm(p=>!p)} style={{...btnAdmin,padding:'.65rem 1.2rem',fontSize:'.9rem',borderRadius:'10px',boxShadow:'none'}}><Plus size={16}/> Add Member</button>
    </div>

                  {showAddMemberForm && (
  <div style={{background:C.adCard,padding:'2rem',borderRadius:'16px',boxShadow:`0 4px 20px rgba(0,0,0,.08)`,border:`1px solid ${C.adBorder}`,marginBottom:'1.5rem',position:'relative'}}>
    <button type="button" onClick={()=>setShowAddMemberForm(false)} style={{position:'absolute',top:'1rem',right:'1rem',width:'32px',height:'32px',borderRadius:'50%',border:`1px solid ${C.adBorder}`,background:C.adBg,color:C.adMid,fontSize:'.9rem',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
    <h3 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:'1.2rem',color:C.adText}}>Add New Member</h3>
    <form onSubmit={async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    const name = fd.get('name');
    const role = fd.get('role');
    const bio  = fd.get('bio');
    if (!name || !role || !bio) {
      showToast('Name, role and bio are required.', 'error');
      return;
    }
    const submitData = new FormData();
    submitData.append('name',       name);
    submitData.append('role',       role);
    submitData.append('email',      fd.get('email') || '');
    submitData.append('joinedYear', fd.get('joinedYear') || String(new Date().getFullYear()));
    submitData.append('bio',        bio);
    const photoFile = fd.get('photo');
    if (photoFile && photoFile.size > 0) {
      submitData.append('photo', photoFile);
    }

    const token = localStorage.getItem('ml_admin_token') || localStorage.getItem('ml_token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/members`, {
      method: 'POST',
      body: submitData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errData.error || 'Failed to add member');
    }

    const saved = await res.json();
    setAdminMembers(prev => [...prev, saved]);
    setShowAddMemberForm(false);
    e.target.reset();
    const pv = document.getElementById('admin-member-photo-preview');
    if (pv) pv.style.display = 'none';
    showToast(`${saved.name} added successfully.`);
  } catch(err) {
    showToast(err.message, 'error');
  }
}}
    style={{display:'flex',flexDirection:'column',gap:'1rem'}}>

      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
        <input type="text"   name="name"       placeholder="Full Name *"              required style={adminInput} onFocus={fi} onBlur={fo}/>
        <input type="text"   name="role"       placeholder="Role / Designation *"     required style={adminInput} onFocus={fi} onBlur={fo}/>
        <input type="email"  name="email"      placeholder="Email Address"                     style={adminInput} onFocus={fi} onBlur={fo}/>
        <input type="tel"    name="phone"      placeholder="Phone Number"                      style={adminInput} onFocus={fi} onBlur={fo}/>
        <input type="text"   name="joinedYear" placeholder="Joined Year (e.g. 2025)"           style={adminInput} onFocus={fi} onBlur={fo}/>
      </div>

      <textarea name="bio" placeholder="Short biography / description *" required rows="3" style={{...adminInput,resize:'vertical'}} onFocus={fi} onBlur={fo}/>

      {/* Photo — device upload only */}
      <div>
        <label style={{fontSize:'.88rem',color:C.adMid,fontWeight:700,display:'block',marginBottom:'.4rem'}}>
          Member Photo
        </label>
        <input
          type="file"
          name="photo"
          accept=".jpg,.jpeg,.png,.webp"
          style={{padding:'.8rem',fontSize:'.9rem',border:`1px solid ${C.adBorder}`,borderRadius:'12px',cursor:'pointer',background:C.adBg,width:'100%',boxSizing:'border-box'}}
          onChange={e=>{
            const f=e.target.files[0];
            if(f){
              const pv=document.getElementById('admin-member-photo-preview');
              if(pv){pv.src=URL.createObjectURL(f);pv.style.display='block';}
            }
          }}
        />
        <div style={{display:'flex',justifyContent:'center',marginTop:'.5rem'}}>
          <img id="admin-member-photo-preview" alt="preview" style={{display:'none',width:'100px',height:'100px',objectFit:'cover',borderRadius:'12px',border:`2px solid ${C.adBorder}`}}/>
        </div>
      </div>

      <div style={{display:'flex',gap:'.8rem'}}>
        <button type="submit" style={{...btnAdmin,flex:1,justifyContent:'center',boxShadow:'none'}}>Add Member</button>
        <button type="button" onClick={()=>setShowAddMemberForm(false)} style={{...btnO,borderColor:C.adBorder,color:C.adMid,borderRadius:'12px',padding:'.75rem 1.4rem'}}>Cancel</button>
      </div>

    </form>
  </div>
)}
                  {/* Delete member confirm modal */}
                  {deleteMemberConfirm && (
                    <Overlay onClose={()=>setDeleteMemberConfirm(null)}>
                      <div style={{background:C.white,borderRadius:'24px',padding:'0',maxWidth:'420px',width:'100%',animation:'popIn .3s ease',boxShadow:'0 20px 60px rgba(0,0,0,.18)',overflow:'hidden'}}>
                        <div style={{background:'linear-gradient(135deg,#402591,#e74c3c)',padding:'1.8rem 2rem',position:'relative',textAlign:'center'}}>
                          <button onClick={()=>setDeleteMemberConfirm(null)} style={{position:'absolute',top:'.8rem',right:'.8rem',background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.4)',borderRadius:'50%',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',fontWeight:700,fontSize:'.85rem'}}>✕</button>
                          <div style={{fontSize:'2rem',marginBottom:'.5rem'}}></div>
                          <div style={{fontSize:'1.2rem',fontWeight:800,color:'#b7b5bd'}}>Remove Member</div>
                        </div>
                        <div style={{padding:'1.8rem 2rem 2rem',textAlign:'center'}}>
                          <p style={{fontSize:'1rem',color:C.adText,margin:'0 0 1.6rem',lineHeight:1.7}}>Remove <strong style={{color:'#c0392b'}}>{deleteMemberConfirm.name}</strong> from the members list?</p>
                          <div style={{display:'flex',gap:'.8rem',justifyContent:'center'}}>
                            <button onClick={()=>setDeleteMemberConfirm(null)} style={{flex:1,padding:'1rem',borderRadius:'12px',border:`2px solid ${C.adBorder}`,background:C.white,color:C.adMid,fontWeight:700,fontSize:'.95rem',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>Cancel</button>
                            <button onClick={async()=>{
                              const {id,name}=deleteMemberConfirm;
                              setDeleteMemberConfirm(null);
                              try{await adminFetch(`/members/${id}`,{method:'DELETE'});}catch{}
                              setAdminMembers(prev=>prev.filter(m=>m._id!==id));
                              showToast(`${name} has been removed.`);
                            }} style={{flex:1,padding:'1rem',borderRadius:'12px',border:'none',background:'linear-gradient(135deg,#c0392b,#e74c3c)',color:'#fff',fontWeight:700,fontSize:'.95rem',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>Remove</button>
                          </div>
                        </div>
                      </div>
                    </Overlay>
                  )}

                  {/* Edit member modal */}
{editingMember && (
  <Overlay onClose={()=>setEditingMember(null)}>
    <div style={{background:C.white,borderRadius:'24px',padding:'0',maxWidth:'520px',width:'100%',animation:'popIn .3s ease',boxShadow:'0 20px 60px rgba(0,0,0,.18)',maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`,padding:'1.6rem 2rem',position:'relative',borderRadius:'24px 24px 0 0'}}>
        <button onClick={()=>setEditingMember(null)} style={{position:'absolute',top:'.8rem',right:'.8rem',background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.4)',borderRadius:'50%',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',fontWeight:700,fontSize:'.85rem'}}>✕</button>
        <div style={{fontSize:'1.2rem',fontWeight:800,color:'#fff'}}>Edit Member Profile</div>
        <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.7)',marginTop:'.2rem'}}>Update {editingMember.name}'s details</div>
      </div>
      <div style={{padding:'1.8rem 2rem 2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.1rem'}}>
          <div>
            <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>Role / Designation</label>
            <input type="text" value={editingMember.role||''} onChange={e=>setEditingMember(p=>({...p,role:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div>
              <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>Email</label>
              <input type="email" value={editingMember.email||''} onChange={e=>setEditingMember(p=>({...p,email:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
            </div>
            <div>
              <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>Phone</label>
              <input type="tel" value={editingMember.phone||''} onChange={e=>setEditingMember(p=>({...p,phone:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
            </div>
          </div>

          <div>
            <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>Joined Year</label>
            <input type="text" value={editingMember.joinedYear||''} onChange={e=>setEditingMember(p=>({...p,joinedYear:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo} placeholder="e.g. 2025"/>
          </div>

          <div>
            <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>Biography</label>
            <textarea rows="4" value={editingMember.bio||''} onChange={e=>setEditingMember(p=>({...p,bio:e.target.value}))} style={{...adminInput,resize:'vertical'}} onFocus={fi} onBlur={fo}/>
          </div>

          {/* PHOTO — device upload only */}
          <div>
            <label style={{display:'block',fontWeight:700,color:C.adText,marginBottom:'.4rem',fontSize:'.9rem'}}>
              Update Photo
            </label>

            {/* Current photo preview */}
            {editingMember.photo && isValidUrl(editingMember.photo) && !editingMember._newPhotoPreview && (
              <div style={{display:'flex',alignItems:'center',gap:'.8rem',background:'#faf9f6',border:`1.5px solid ${C.adBorder}`,borderRadius:'12px',padding:'.8rem 1rem',marginBottom:'.8rem'}}>
                <div style={{width:'52px',height:'52px',borderRadius:'10px',background:C.adBorder,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                  <img src={getPhotoSrc(editingMember.photo)} alt="current" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div style={{fontSize:'.82rem',color:C.adMid}}>Current photo</div>
              </div>
            )}

            {/* New photo preview */}
            {editingMember._newPhotoPreview && (
              <div style={{display:'flex',alignItems:'center',gap:'.8rem',background:'#faf9f6',border:`1.5px solid ${C.adAccent}`,borderRadius:'12px',padding:'.8rem 1rem',marginBottom:'.8rem'}}>
                <div style={{width:'52px',height:'52px',borderRadius:'10px',overflow:'hidden',flexShrink:0}}>
                  <img src={editingMember._newPhotoPreview} alt="new" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div style={{fontSize:'.82rem',color:C.adAccent,fontWeight:700}}>New photo selected</div>
              </div>
            )}

            {/* File input */}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              style={{padding:'.8rem',fontSize:'.9rem',border:`1px solid ${C.adBorder}`,borderRadius:'12px',cursor:'pointer',background:C.adBg,width:'100%',boxSizing:'border-box'}}
              onChange={e=>{
                const f=e.target.files[0];
                if(f) setEditingMember(p=>({...p,_newPhotoFile:f,_newPhotoPreview:URL.createObjectURL(f)}));
              }}
            />
          </div>

          {/* Save / Cancel */}
          <div style={{display:'flex',gap:'.8rem',marginTop:'.3rem'}}>
            <button onClick={async()=>{
              try{
                if (editingMember._newPhotoFile) {
  const fd = new FormData();
  fd.append('name',       editingMember.name);
  fd.append('role',       editingMember.role || '');
  fd.append('email',      editingMember.email || '');
  fd.append('joinedYear', String(editingMember.joinedYear || ''));
  fd.append('bio',        editingMember.bio || '');
  fd.append('photo',      editingMember._newPhotoFile);

  const token = localStorage.getItem('ml_admin_token') || localStorage.getItem('ml_token');
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/members/${editingMember._id}`, {
    method: 'PUT',
    body: fd,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errData.error || 'Failed to update member');
  }
  const updated = await res.json();
  setAdminMembers(prev => prev.map(m => m._id === editingMember._id ? updated : m));
} else {
                  const {_newPhotoFile,_newPhotoPreview,...clean}=editingMember;
                  await adminFetch(`/members/${editingMember._id}`,{method:'PUT',body:JSON.stringify(clean)});
                  setAdminMembers(prev=>prev.map(m=>m._id===editingMember._id?{...clean}:m));
                }
                showToast(`${editingMember.name}'s profile updated.`);
                setEditingMember(null);
              }catch(err){showToast(err.message,'error');}
            }} style={{...btnAdmin,flex:1,justifyContent:'center',borderRadius:'12px',boxShadow:'none',padding:'1rem'}}>
              ✓ Save Changes
            </button>
            <button onClick={()=>setEditingMember(null)} style={{...btnO,borderColor:C.adBorder,color:C.adMid,borderRadius:'12px',padding:'1rem 1.4rem'}}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  </Overlay>
)}

                 <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)', gap:'1.2rem'}}>
                    {[...adminMembers]
                      .filter(m => {
                        const q = searchMembers.toLowerCase();
                        if (!q) return true;
                        return (m.name||'').toLowerCase().includes(q) ||
                               (m.role||'').toLowerCase().includes(q) ||
                               (m.email||'').toLowerCase().includes(q) ||
                               (m.bio||'').toLowerCase().includes(q);
                      })
                      .sort((a,b)=>(parseInt(a.sortOrder)||999)-(parseInt(b.sortOrder)||999)).map((member, idx)=>(
                  <div key={member._id} style={{background:C.adCard,borderRadius:'16px',overflow:'hidden',boxShadow:`0 2px 16px rgba(0,0,0,.06)`,border:`1px solid ${C.adBorder}`}}>
                <div style={{height:'340px',background:'linear-gradient(135deg,#f0ede6,#e8e3dc)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',borderRadius:'16px 16px 0 0'}}>
  {isValidUrl(member.photo)
    ? <img src={getPhotoSrc(member.photo)} alt={member.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 15%',display:'block'}}/>
                  : <div style={{width:'80px',height:'80px',borderRadius:'50%',background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem',color:'#fff'}}>{(member.name||'M')[0].toUpperCase()}</div>
                  }
                          <button onClick={()=>setDeleteMemberConfirm({id:member._id,name:member.name})} style={{position:'absolute',top:'.6rem',left:'.6rem',background:'rgba(255,255,255,.95)',border:`1px solid #f5c6cb`,borderRadius:'8px',width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} title="Remove member">
                            <Trash2 size={13} color="#622bc0"/>
                          </button>
                        </div>
                        <div style={{padding:'1.1rem 1.2rem'}}>
  <div style={{fontWeight:800,color:C.adText,fontSize:'1.1rem',marginBottom:'.2rem'}}>{member.name}</div>
  <div style={{display:'inline-block',background:`rgba(90,138,94,.12)`,color:C.adAccent,borderRadius:'50px',padding:'.2rem .8rem',fontSize:'.8rem',fontWeight:700,marginBottom:'.6rem'}}>{member.role}</div>
  <p style={{fontSize:'.88rem',color:C.adMid,margin:'0 0 .5rem',lineHeight:1.55,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{member.bio}</p>
  {member.email&&<div style={{fontSize:'.78rem',color:C.adMid,display:'flex',alignItems:'center',gap:'.3rem',marginBottom:'.7rem'}}><Mail size={11} color={C.adAccent}/>{member.email}</div>}
                          <div style=
                          {{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.5rem',background:'#faf9f6',border:`1.5px solid ${C.adBorder}`,borderRadius:'10px',padding:'.4rem .7rem'}}>
  <span style={{fontSize:'.78rem',fontWeight:700,color:C.adMid,whiteSpace:'nowrap'}}>Display order #</span>
  <input
    type="number"
    min="1"
    placeholder="e.g. 1"
    defaultValue={member.sortOrder||''}
    onBlur={async e=>{
      const val = parseInt(e.target.value);
      if(isNaN(val)||val<1){e.target.value=member.sortOrder||'';return;}
      const updated = {...member, sortOrder: val};
      setAdminMembers(prev=>prev.map(m=>m._id===member._id?updated:m));
      // Save order to localStorage
      try{
        const current = JSON.parse(localStorage.getItem('ml_member_order')||'{}');
        current[member._id] = val;
        localStorage.setItem('ml_member_order', JSON.stringify(current));
      }catch{}
      // Try saving to backend
      try{
        await adminFetch(`/members/${member._id}`,{method:'PUT',body:JSON.stringify({...member,sortOrder:val})});
      }catch{}
      showToast(`Order #${val} set for ${member.name}`);
    }}
    style={{
      width:'52px',border:'none',background:'transparent',
      fontSize:'.9rem',fontWeight:800,color:C.adAccent,
      outline:'none',textAlign:'center',fontFamily:"'Crimson Pro',Georgia,serif",
      MozAppearance:'textfield',
    }}
    onFocus={e=>e.target.select()}
  />
</div>
<button onClick={()=>setEditingMember({...member})} style={{width:'100%',background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`,color:'#fff',border:'none',borderRadius:'10px',padding:'.6rem',fontSize:'.85rem',fontWeight:700,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif",display:'flex',alignItems:'center',justifyContent:'center',gap:'.4rem'}}>
   Edit Details
</button>
                        </div>
                      </div>
                    ))}
                    {adminMembers.length===0 && <div style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:C.adMid}}>No members found</div>}
                  </div>
                </div>
              )}
            {tab==='goods-donations' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    <div style={{ background:C.adCard, borderRadius:'18px', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}`, overflow:'hidden' }}>
      <div style={{ padding:'1.2rem 1.5rem', borderBottom:`1px solid ${C.adBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.8rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.8rem', flexWrap:'wrap', flex:1 }}>
          <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:C.adText }}>Goods Donations ({goodsDonations.length})</h3>
          <div style={{ position:'relative' }}>
<span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
            <input type="text" placeholder="Search by name, items, state…" value={searchGoods}
              onChange={e => setSearchGoods(e.target.value)}
              style={searchBarStyle}
              onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
            />
          </div>
        </div>
        <div style={{ display:'flex', gap:'.6rem' }}>
          <div style={{ background:'#fdf3e8', borderRadius:'10px', padding:'.4rem .85rem', fontSize:'.82rem', fontWeight:700, color:C.adGold }}>
            {goodsDonations.filter(g=>!g.status||g.status==='pending').length} pending
          </div>
          <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.4rem .85rem', fontSize:'.82rem', fontWeight:700, color:C.adAccent }}>
            {goodsDonations.filter(g=>g.status==='approved').length} approved
          </div>
        </div>
      </div>
 
      {goodsDonations.length === 0 ? (
        <div style={{ padding:'3rem', textAlign:'center', color:C.adMid }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}></div>
          <div style={{ fontWeight:700, color:C.adText, marginBottom:'.4rem' }}>No goods donations yet</div>
          <div style={{ fontSize:'.88rem' }}>When donors schedule goods donations, they'll appear here.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
         {[...goodsDonations]
            .filter(g => {
              const q = searchGoods.toLowerCase();
              if (!q) return true;
              return (g.donorName||'').toLowerCase().includes(q) ||
                     (g.items||'').toLowerCase().includes(q) ||
                     (g.state||'').toLowerCase().includes(q) ||
                     (g.email||'').toLowerCase().includes(q) ||
                     (g.status||'').toLowerCase().includes(q);
            })
            .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((g,i)=>(
            <div key={g._id||i} style={{ borderBottom:`1px solid ${C.adBorder}` }}
              onMouseEnter={e=>e.currentTarget.style.background='#faf9f6'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
 
              {/* Row header */}
              <div style={{ padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.8rem' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#c9975a,#b8843d)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.85rem', flexShrink:0 }}>
                    {(g.donorName||'?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:800, color:C.adText, fontSize:'.95rem' }}>{g.donorName}</div>
                    <div style={{ fontSize:'.78rem', color:C.adMid, marginTop:'.1rem' }}>
                      {g.createdAt && new Date(g.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem', flexShrink:0 }}>
                  <span style={{ padding:'.25rem .8rem', borderRadius:'50px', fontSize:'.72rem', fontWeight:800,
                    background: g.status==='approved'?'#eef4ee': g.status==='rejected'?'#fff0f0':'#fdf3e8',
                    color: g.status==='approved'?C.adAccent: g.status==='rejected'?'#c0392b':C.adGold }}>
                    {(g.status||'PENDING').toUpperCase()}
                  </span>
                  {(!g.status||g.status==='pending') && (
                    <div style={{ display:'flex', gap:'.4rem' }}>
                      <button onClick={async()=>{
                        try{ await adminFetch(`/goods-donations/${g._id}`,{method:'PATCH',body:JSON.stringify({status:'approved'})}); }catch{}
                        setGoodsDonations(prev=>prev.map(x=>x._id===g._id?{...x,status:'approved'}:x));
                        showToast('Goods donation approved!');
                      }} style={{ padding:'.4rem .8rem', borderRadius:'8px', background:'#eef4ee', border:`1.5px solid rgba(90,138,94,.3)`, color:C.adAccent, fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>✓ Approve</button>
                      <button onClick={async()=>{
                        try{ await adminFetch(`/goods-donations/${g._id}`,{method:'PATCH',body:JSON.stringify({status:'rejected'})}); }catch{}
                        setGoodsDonations(prev=>prev.map(x=>x._id===g._id?{...x,status:'rejected'}:x));
                        showToast('Goods donation rejected.');
                      }} style={{ padding:'.4rem .8rem', borderRadius:'8px', background:'#fff0f0', border:`1.5px solid #f5c6cb`, color:'#c0392b', fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>✕ Reject</button>
                    </div>
                  )}
                </div>
              </div>
 
              {/* Detail body */}
              <div style={{ padding:'0 1.5rem 1.2rem' }}>
 
                {/* Contact info row */}
                <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', marginBottom:'.9rem', padding:'.7rem 1rem', background:'#fafaf8', borderRadius:'10px', border:`1px solid ${C.adBorder}` }}>
                  {g.email && (
                    <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem' }}>
                      <Mail size={13} color={C.adAccent}/>
                      <a href={`mailto:${g.email}`} style={{ color:C.adAccent, textDecoration:'none', fontWeight:600 }}>{g.email}</a>
                    </div>
                  )}
                  {g.phone && (
                    <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem' }}>
                      <Phone size={13} color={C.adAccent}/>
                      <span style={{ color:C.adText, fontWeight:600 }}>{g.phone}</span>
                    </div>
                  )}
                  {g.state && (
                    <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem' }}>
                      <MapPin size={13} color={C.adAccent}/>
                      <span style={{ color:C.adText, fontWeight:600 }}>{g.state}{g.pincode ? ` – ${g.pincode}` : ''}</span>
                    </div>
                  )}
                </div>
 
                {/* Address */}
                {g.address && (
                  <div style={{ marginBottom:'.9rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.35rem' }}>Pickup  Address</div>
                    <div style={{ fontSize:'.88rem', color:C.adText, lineHeight:1.5, padding:'.6rem .85rem', background:'#faf9f6', borderRadius:'8px', border:`1px solid ${C.adBorder}` }}>{g.address}</div>
                  </div>
                )}
 
                {/* Items + Quantity + Condition row */}
                <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap:'.7rem', marginBottom:'.9rem' }}>
                  <div style={{ background:'#fff8f0', borderRadius:'10px', padding:'.7rem .9rem', border:`1px solid #f5e3c8` }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adGold, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Items Donated</div>
                    <div style={{ fontSize:'.88rem', fontWeight:700, color:C.adText }}>
                      {(g.items||'').split(',').map(item=>item.trim()).filter(Boolean).map((item,idx)=>(
                        <span key={idx} style={{ display:'inline-block', background:'#fdf3e8', border:`1px solid rgba(201,151,90,.3)`, borderRadius:'50px', padding:'.1rem .6rem', fontSize:'.78rem', fontWeight:700, color:C.adGold, marginRight:'.3rem', marginBottom:'.3rem' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {g.quantity && (
                    <div style={{ background:'#f4f8ff', borderRadius:'10px', padding:'.7rem .9rem', border:'1px solid #c8d8f5' }}>
                      <div style={{ fontSize:'.72rem', fontWeight:700, color:'#3a7abd', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Quantity</div>
                      <div style={{ fontSize:'.88rem', fontWeight:700, color:C.adText }}>{g.quantity}</div>
                    </div>
                  )}
                  {g.condition && (
                    <div style={{ background:'#f4fff8', borderRadius:'10px', padding:'.7rem .9rem', border:'1px solid #b8e8c8' }}>
                      <div style={{ fontSize:'.72rem', fontWeight:700, color:'#2a7d4f', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Condition</div>
                      <div style={{ fontSize:'.88rem', fontWeight:700, color:C.adText, textTransform:'capitalize' }}>{g.condition?.replace(/-/g,' ')}</div>
                    </div>
                  )}
                </div>
 
                {/* Item-specific details */}
                {(g.foodType||g.foodPackaged||g.foodExpiry) && (
                  <div style={{ background:'#fffbf4', border:'1px solid #f5e6c8', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adGold, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>🥫 Food Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.foodType && <span><strong>Type:</strong> {g.foodType}</span>}
                      {g.foodPackaged && <span><strong>Packaged:</strong> {g.foodPackaged}</span>}
                      {g.foodExpiry && <span><strong>Expires:</strong> {new Date(g.foodExpiry).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>}
                    </div>
                  </div>
                )}
                {(g.clothingType||g.clothingAge||g.clothingGender||g.clothesWashed) && (
                  <div style={{ background:'#f4f8ff', border:'1px solid #c8d8f5', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#3a7abd', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>👕 Clothing Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.clothingType && <span><strong>Type:</strong> {g.clothingType}</span>}
                      {g.clothingAge && <span><strong>Age Group:</strong> {g.clothingAge} yrs</span>}
                      {g.clothingGender && <span><strong>Gender:</strong> {g.clothingGender}</span>}
                      {g.clothesWashed && <span><strong>Washed:</strong> {g.clothesWashed}</span>}
                    </div>
                  </div>
                )}
                {(g.bookType||g.bookAge||g.bookLanguage||g.bookCondition) && (
                  <div style={{ background:'#f4fff8', border:'1px solid #b8e8c8', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#2a7d4f', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>📚 Book Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.bookType && <span><strong>Type:</strong> {g.bookType}</span>}
                      {g.bookAge && <span><strong>Age:</strong> {g.bookAge} yrs</span>}
                      {g.bookLanguage && <span><strong>Language:</strong> {g.bookLanguage}</span>}
                      {g.bookCondition && <span><strong>Condition:</strong> {g.bookCondition}</span>}
                    </div>
                  </div>
                )}
                {(g.toyType||g.toyAge||g.toyParts) && (
                  <div style={{ background:'#fff8f0', border:'1px solid #fad9b0', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#c9750a', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>🧸 Toy Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.toyType && <span><strong>Type:</strong> {g.toyType}</span>}
                      {g.toyAge && <span><strong>Age:</strong> {g.toyAge} yrs</span>}
                      {g.toyParts && <span><strong>Parts:</strong> {g.toyParts}</span>}
                    </div>
                  </div>
                )}
                {g.hygieneItems && (
                  <div style={{ background:'#f0f8ff', border:'1px solid #b0d4f5', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#3a7abd', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>🧴 Hygiene Items</div>
                    <div style={{ fontSize:'.85rem', color:C.adText }}>{g.hygieneItems}</div>
                  </div>
                )}
                {(g.blanketType||g.blanketSize) && (
                  <div style={{ background:'#fdf4ff', border:'1px solid #e0c0f0', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#7a3ab5', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>🛏️ Bedding Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.blanketType && <span><strong>Type:</strong> {g.blanketType}</span>}
                      {g.blanketSize && <span><strong>Size:</strong> {g.blanketSize}</span>}
                    </div>
                  </div>
                )}
                {g.statItems && (
                  <div style={{ background:'#fffdf0', border:'1px solid #f0e0a0', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#9a8000', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>✏️ Stationery Items</div>
                    <div style={{ fontSize:'.85rem', color:C.adText }}>{g.statItems}</div>
                  </div>
                )}
                {(g.footwearType||g.footwearSize) && (
                  <div style={{ background:'#fff4f0', border:'1px solid #f5c8b0', borderRadius:'10px', padding:'.7rem .9rem', marginBottom:'.7rem' }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:'#c05000', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>👟 Footwear Details</div>
                    <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', fontSize:'.85rem', color:C.adText }}>
                      {g.footwearType && <span><strong>Type:</strong> {g.footwearType}</span>}
                      {g.footwearSize && <span><strong>Size:</strong> {g.footwearSize}</span>}
                    </div>
                  </div>
                )}
 
                {/* Notes */}
                {g.notes && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.7rem .9rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Additional Notes</div>
                    <div style={{ fontSize:'.88rem', color:C.adText, fontStyle:'italic' }}>{g.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
 

          {tab==='vol-requests' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    <div style={{ background:C.adCard, borderRadius:'20px', padding:'1.4rem 1.8rem', marginBottom:'1.5rem', border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
      <div>
        <h3 style={{ margin:'0 0 .2rem', fontSize:'1.1rem', fontWeight:800, color:C.adText }}>Volunteer Requests</h3>
        <p style={{ margin:0, fontSize:'.85rem', color:C.adMid }}>Review applications — approving a request creates a permanent volunteer profile.</p>
      </div>
      <div style={{ display:'flex', gap:'.6rem' }}>
        <div style={{ background:'#fff8f0', borderRadius:'10px', padding:'.4rem .85rem', fontSize:'.82rem', fontWeight:700, color:'#c07c2a' }}>{volunteers.filter(v=>v.status==='pending').length} pending</div>
        <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.4rem .85rem', fontSize:'.82rem', fontWeight:700, color:C.adAccent }}>{volunteers.filter(v=>v.status==='approved').length} approved</div>
      </div>
    </div>
    <div style={{ marginBottom:'1.2rem' }}>
      <div style={{ position:'relative', maxWidth:'360px' }}>
        <span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
        <input type="text" placeholder="Search by name, email, skills…" value={searchVolunteers}
          onChange={e => setSearchVolunteers(e.target.value)}
          style={searchBarStyle}
          onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
          onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
        />
      </div>
    </div>
    {volunteers.length===0 ? (
      <div style={{ background:C.adCard, borderRadius:'18px', padding:'3rem', textAlign:'center', color:C.adMid, boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`1px solid ${C.adBorder}` }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>🤝</div>
        <div style={{ fontWeight:700, color:C.adText, marginBottom:'.4rem' }}>No volunteer applications yet</div>
        <div style={{ fontSize:'.88rem' }}>Applications submitted through the website will appear here.</div>
      </div>
    ) : (
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {[...volunteers]
          .filter(v => {
            const q = searchVolunteers.toLowerCase();
            if (!q) return true;
            return (v.fullName||'').toLowerCase().includes(q) ||
                   (v.email||'').toLowerCase().includes(q) ||
                   (v.occupation||'').toLowerCase().includes(q) ||
                   (v.status||'').toLowerCase().includes(q) ||
                   (Array.isArray(v.areas)?v.areas.join(' '):v.areas||'').toLowerCase().includes(q);
          })
          .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((v,i)=>(
          <div key={v._id||i} style={{ background:C.adCard, borderRadius:'16px', overflow:'hidden', boxShadow:`0 2px 16px rgba(0,0,0,.05)`, border:`2px solid ${v.status==='pending'?'rgba(217,119,87,.3)':v.status==='approved'?'rgba(90,138,94,.25)':'rgba(192,57,43,.15)'}` }}>
            <div style={{ padding:'1rem 1.4rem', background:'#fafaf8', borderBottom:`1px solid ${C.adBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.8rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:`linear-gradient(135deg,#d97757,#c65d3f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.95rem', flexShrink:0 }}>
                  {(v.fullName||'?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem' }}>{v.fullName}</div>
                  <div style={{ fontSize:'.78rem', color:C.adMid, marginTop:'.1rem' }}>
                    {v.createdAt && new Date(v.createdAt).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
                  </div>
                </div>
              </div>
              <span style={{ background:v.status==='approved'?'#eef4ee':v.status==='rejected'?'#fff0f0':'#fff8f0', border:`1.5px solid ${v.status==='approved'?'rgba(90,138,94,.25)':v.status==='rejected'?'rgba(192,57,43,.2)':'rgba(217,119,87,.3)'}`, borderRadius:'50px', padding:'.25rem .9rem', fontSize:'.72rem', fontWeight:800, color:v.status==='approved'?C.adAccent:v.status==='rejected'?'#c0392b':'#c07c2a', whiteSpace:'nowrap' }}>
                {v.status.toUpperCase()}
              </span>
            </div>
            <div style={{ padding:'1.1rem 1.4rem' }}>
              <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(4,1fr)', gap:'.7rem', marginBottom:'1rem' }}>
                {v.email && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.6rem .85rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.25rem' }}>Email</div>
                    <a href={`mailto:${v.email}`} style={{ fontSize:'.82rem', fontWeight:700, color:C.adAccent, textDecoration:'none', display:'flex', alignItems:'center', gap:'.3rem' }}>
                      <Mail size={12}/><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.email}</span>
                    </a>
                  </div>
                )}
                {v.phone && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.6rem .85rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.25rem' }}>Phone</div>
                    <div style={{ fontSize:'.82rem', fontWeight:700, color:C.adText, display:'flex', alignItems:'center', gap:'.3rem' }}>
                      <Phone size={12} color={C.adAccent}/>{v.phone}
                    </div>
                  </div>
                )}
                {v.age && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.6rem .85rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.25rem' }}>Age</div>
                    <div style={{ fontSize:'.88rem', fontWeight:800, color:C.adText }}>{v.age} years</div>
                  </div>
                )}
                {v.occupation && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.6rem .85rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.25rem' }}>Occupation</div>
                    <div style={{ fontSize:'.82rem', fontWeight:700, color:C.adText }}>{v.occupation}</div>
                  </div>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:'.7rem', marginBottom:'1rem' }}>
                {v.availability && (
                  <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.6rem .9rem', border:`1px solid rgba(90,138,94,.2)` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adAccent, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.25rem' }}>Availability</div>
                    <div style={{ fontSize:'.88rem', fontWeight:800, color:C.adText, textTransform:'capitalize' }}>{v.availability}</div>
                  </div>
                )}
                {v.areas && v.areas.length > 0 && (
                  <div style={{ background:'#faf9f6', borderRadius:'10px', padding:'.6rem .9rem', border:`1px solid ${C.adBorder}` }}>
                    <div style={{ fontSize:'.68rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>Areas of Interest</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'.3rem' }}>
                      {(Array.isArray(v.areas) ? v.areas : [v.areas]).map((area,idx)=>(
                        <span key={idx} style={{ background:`rgba(217,119,87,.1)`, border:`1px solid rgba(217,119,87,.25)`, borderRadius:'50px', padding:'.1rem .55rem', fontSize:'.75rem', fontWeight:700, color:'#c65d3f' }}>{area}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {v.experience && (
                <div style={{ marginBottom:'.9rem' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.35rem' }}>Previous Experience</div>
                  <p style={{ fontSize:'.88rem', color:C.adText, margin:0, lineHeight:1.65, background:'#faf9f6', borderRadius:'9px', padding:'.7rem .9rem', border:`1px solid ${C.adBorder}` }}>{v.experience}</p>
                </div>
              )}
              {v.motivation && (
                <div style={{ marginBottom: v.status==='pending' ? '.9rem' : 0 }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.35rem' }}>Motivation</div>
                  <p style={{ fontSize:'.9rem', color:C.adText, margin:0, lineHeight:1.7, background:'linear-gradient(135deg,#fafaf8,#f5f0ea)', borderRadius:'9px', padding:'.75rem .9rem', border:`1px solid ${C.adBorder}`, fontStyle:'italic' }}>"{v.motivation}"</p>
                </div>
              )}
              {v.status==='pending' && (
                <div style={{ display:'flex', gap:'.6rem', marginTop:'.9rem' }}>
                  <button onClick={async()=>{
                    try{ await adminFetch(`/volunteers/${v._id}`,{method:'PATCH',body:JSON.stringify({status:'approved'})}); }catch{}
                    setVolunteers(prev=>prev.map(x=>x._id===v._id?{...x,status:'approved'}:x));
                    const profile = {
                      _id: v._id, fullName: v.fullName, email: v.email, phone: v.phone,
                      age: v.age, occupation: v.occupation, availability: v.availability,
                      areas: v.areas, experience: v.experience, motivation: v.motivation,
                      approvedAt: new Date().toISOString(), joinedYear: new Date().getFullYear(),
                      status: 'approved',
                    };
                    setVolProfiles(prev => {
                      const exists = prev.find(p=>p._id===v._id);
                      const updated = exists ? prev.map(p=>p._id===v._id?profile:p) : [...prev, profile];
                      try{ localStorage.setItem('ml_vol_profiles', JSON.stringify(updated)); }catch{}
                      return updated;
                    });
                    showToast(`${v.fullName} approved — profile created in Volunteer Profiles.`);
                  }} style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, color:'#fff', border:'none', borderRadius:'10px', padding:'.65rem 1.4rem', fontSize:'.88rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                    <CheckCircle size={15}/> Approve & Create Profile
                  </button>
                  <button onClick={async()=>{
                    try{ await adminFetch(`/volunteers/${v._id}`,{method:'PATCH',body:JSON.stringify({status:'rejected'})}); }catch{}
                    setVolunteers(prev=>prev.map(x=>x._id===v._id?{...x,status:'rejected'}:x));
                    showToast('Volunteer request rejected.');
                  }} style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'transparent', border:'1.5px solid rgba(192,57,43,.3)', color:'#c0392b', borderRadius:'10px', padding:'.65rem 1.2rem', fontSize:'.88rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                    <X size={15}/> Reject
                  </button>
                  {v.email && (
                    <a href={`mailto:${v.email}`} style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'#faf9f6', border:`1.5px solid ${C.adBorder}`, color:C.adMid, borderRadius:'10px', padding:'.65rem 1.2rem', fontSize:'.88rem', fontWeight:700, textDecoration:'none', fontFamily:"'Crimson Pro',Georgia,serif" }}>
                      <Mail size={15}/> Email
                    </a>
                  )}
                </div>
              )}
              {v.status==='approved' && (
                <div style={{ marginTop:'.9rem', display:'flex', alignItems:'center', gap:'.6rem', background:'#eef4ee', borderRadius:'10px', padding:'.7rem 1rem', border:`1px solid rgba(90,138,94,.2)` }}>
                  <CheckCircle size={15} color={C.adAccent}/>
                  <span style={{ fontSize:'.85rem', fontWeight:700, color:C.adAccent }}>Approved — profile saved in Volunteer Profiles</span>
                  <button onClick={()=>goToTab('vol-profiles')} style={{ marginLeft:'auto', background:'none', border:`1.5px solid ${C.adAccent}`, borderRadius:'8px', padding:'.3rem .8rem', fontSize:'.78rem', fontWeight:700, color:C.adAccent, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>View Profile →</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{tab==='vol-profiles' && (
  <div style={{ animation:'fadeIn .4s ease' }}>
    {/* Edit profile modal */}
    {editingVolProfile && (
      <Overlay onClose={()=>setEditingVolProfile(null)}>
        <div style={{ background:C.white, borderRadius:'24px', padding:'0', maxWidth:'520px', width:'100%', animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.18)', maxHeight:'90vh', overflowY:'auto' }}>
          <div style={{ background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, padding:'1.6rem 2rem', position:'relative', borderRadius:'24px 24px 0 0' }}>
            <button onClick={()=>setEditingVolProfile(null)} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontWeight:700, fontSize:'.85rem' }}>✕</button>
            <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff' }}>Edit Volunteer Profile</div>
            <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.7)', marginTop:'.2rem' }}>Update {editingVolProfile.fullName}'s details</div>
          </div>
          <div style={{ padding:'1.8rem 2rem 2rem' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Full Name</label>
                  <input type="text" value={editingVolProfile.fullName||''} onChange={e=>setEditingVolProfile(p=>({...p,fullName:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Occupation</label>
                  <input type="text" value={editingVolProfile.occupation||''} onChange={e=>setEditingVolProfile(p=>({...p,occupation:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Email</label>
                  <input type="email" value={editingVolProfile.email||''} onChange={e=>setEditingVolProfile(p=>({...p,email:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Phone</label>
                  <input type="tel" value={editingVolProfile.phone||''} onChange={e=>setEditingVolProfile(p=>({...p,phone:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Age</label>
                  <input type="number" value={editingVolProfile.age||''} onChange={e=>setEditingVolProfile(p=>({...p,age:e.target.value}))} style={adminInput} onFocus={fi} onBlur={fo}/>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Availability</label>
                  <select value={editingVolProfile.availability||''} onChange={e=>setEditingVolProfile(p=>({...p,availability:e.target.value}))} style={{...adminInput,cursor:'pointer'}} onFocus={fi} onBlur={fo}>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="both">Both</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontWeight:700, color:C.adText, marginBottom:'.4rem', fontSize:'.9rem' }}>Notes / Role Description</label>
                <textarea rows="3" value={editingVolProfile.notes||''} onChange={e=>setEditingVolProfile(p=>({...p,notes:e.target.value}))} style={{...adminInput,resize:'vertical'}} onFocus={fi} onBlur={fo} placeholder="Any notes about this volunteer's role or responsibilities…"/>
              </div>
              <div style={{ display:'flex', gap:'.8rem', marginTop:'.3rem' }}>
                <button onClick={()=>{
                  setVolProfiles(prev=>{
                    const updated = prev.map(p=>p._id===editingVolProfile._id?editingVolProfile:p);
                    try{ localStorage.setItem('ml_vol_profiles', JSON.stringify(updated)); }catch{}
                    return updated;
                  });
                  showToast(`${editingVolProfile.fullName}'s profile updated.`);
                  setEditingVolProfile(null);
                }} style={{...btnAdmin,flex:1,justifyContent:'center',borderRadius:'12px',boxShadow:'none',padding:'1rem'}}>
                  ✓ Save Changes
                </button>
                <button onClick={()=>setEditingVolProfile(null)} style={{...btnO,borderColor:C.adBorder,color:C.adMid,borderRadius:'12px',padding:'1rem 1.4rem'}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    )}

    {/* Delete profile confirm */}
    {deleteVolProfileConfirm && (
      <Overlay onClose={()=>setDeleteVolProfileConfirm(null)}>
        <div style={{ background:C.white, borderRadius:'24px', padding:'0', maxWidth:'420px', width:'100%', animation:'popIn .3s ease', boxShadow:'0 20px 60px rgba(0,0,0,.18)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#c0392b,#e74c3c)', padding:'1.8rem 2rem', position:'relative', textAlign:'center' }}>
            <button onClick={()=>setDeleteVolProfileConfirm(null)} style={{ position:'absolute', top:'.8rem', right:'.8rem', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontWeight:700, fontSize:'.85rem' }}>✕</button>
            <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}></div>
            <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff' }}>Remove Volunteer Profile</div>
            <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.8)', marginTop:'.2rem' }}>This action cannot be undone</div>
          </div>
          <div style={{ padding:'1.8rem 2rem 2rem', textAlign:'center' }}>
            <p style={{ fontSize:'1rem', color:C.adText, margin:'0 0 1.6rem', lineHeight:1.7 }}>Remove <strong style={{ color:'#c0392b' }}>{deleteVolProfileConfirm.name}</strong> from volunteer profiles?</p>
            <div style={{ display:'flex', gap:'.8rem', justifyContent:'center' }}>
              <button onClick={()=>setDeleteVolProfileConfirm(null)} style={{ flex:1, padding:'1rem', borderRadius:'12px', border:`2px solid ${C.adBorder}`, background:C.white, color:C.adMid, fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>Cancel</button>
              <button onClick={()=>{
                setVolProfiles(prev=>{
                  const updated = prev.filter(p=>p._id!==deleteVolProfileConfirm.id);
                  try{ localStorage.setItem('ml_vol_profiles', JSON.stringify(updated)); }catch{}
                  return updated;
                });
                showToast(`${deleteVolProfileConfirm.name} removed from profiles.`);
                setDeleteVolProfileConfirm(null);
              }} style={{ flex:1, padding:'1rem', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#c0392b,#e74c3c)', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif" }}>Remove</button>
            </div>
          </div>
        </div>
      </Overlay>
    )}

    {/* Header */}
    <div style={{ background:C.adCard, borderRadius:'20px', padding:'1.4rem 1.8rem', marginBottom:'1.5rem', border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
      <div>
        <h3 style={{ margin:'0 0 .2rem', fontSize:'1.1rem', fontWeight:800, color:C.adText }}>Volunteer Profiles</h3>
        <p style={{ margin:0, fontSize:'.85rem', color:C.adMid }}>Profiles of all approved volunteers. Approve requests in Vol. Requests to add profiles here.</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'.8rem' }}>
        <div style={{ background:'#eef4ee', borderRadius:'10px', padding:'.4rem .85rem', fontSize:'.82rem', fontWeight:700, color:C.adAccent }}>{volProfiles.length} profile{volProfiles.length!==1?'s':''}</div>
        <button onClick={()=>goToTab('vol-requests')} style={{...btnAdmin, padding:'.55rem 1.1rem', fontSize:'.85rem', borderRadius:'10px', boxShadow:'none'}}>+ Review Requests</button>
      </div>
    </div>

    {/* Search */}
    <div style={{ marginBottom:'1.2rem' }}>
      <div style={{ position:'relative', maxWidth:'360px' }}>
        <span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', color:C.adMid, pointerEvents:'none', fontSize:'1.2rem', lineHeight:1 }}>⌕</span>
        <input type="text" placeholder="Search by name, skill, email…" value={searchVolProfiles}
          onChange={e=>setSearchVolProfiles(e.target.value)}
          style={searchBarStyle}
          onFocus={e=>{e.target.style.borderColor=C.adAccent;e.target.style.boxShadow=`0 0 0 3px rgba(90,138,94,.12)`;}}
          onBlur={e=>{e.target.style.borderColor=C.adBorder;e.target.style.boxShadow='none';}}
        />
      </div>
    </div>

    {volProfiles.length === 0 ? (
      <div style={{ background:C.adCard, borderRadius:'18px', padding:'4rem 2rem', textAlign:'center', border:`1px solid ${C.adBorder}`, boxShadow:`0 2px 16px rgba(0,0,0,.05)` }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🤝</div>
        <div style={{ fontWeight:800, color:C.adText, fontSize:'1.1rem', marginBottom:'.5rem' }}>No volunteer profiles yet</div>
        <div style={{ fontSize:'.9rem', color:C.adMid, marginBottom:'1.5rem' }}>Approve volunteer requests to automatically create profiles here.</div>
        <button onClick={()=>goToTab('vol-requests')} style={{...btnAdmin, boxShadow:'none', borderRadius:'12px'}}>Go to Vol. Requests</button>
      </div>
    ) : (
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)', gap:'1.2rem' }}>
        {volProfiles
          .filter(p=>{
            const q=searchVolProfiles.toLowerCase();
            if(!q) return true;
            return (p.fullName||'').toLowerCase().includes(q)||
                   (p.email||'').toLowerCase().includes(q)||
                   (p.occupation||'').toLowerCase().includes(q)||
                   (Array.isArray(p.areas)?p.areas.join(' '):(p.areas||'')).toLowerCase().includes(q);
          })
          .map((p,i)=>(
          <div key={p._id||i} style={{ background:C.adCard, borderRadius:'16px', overflow:'hidden', boxShadow:`0 2px 16px rgba(0,0,0,.06)`, border:`1px solid ${C.adBorder}` }}>
            {/* Profile card header */}
            <div style={{ background:`linear-gradient(135deg,${C.adAccent}18,rgba(90,138,94,.06))`, padding:'1.4rem 1.2rem', borderBottom:`1px solid ${C.adBorder}`, position:'relative' }}>
              <button onClick={()=>setDeleteVolProfileConfirm({id:p._id,name:p.fullName})} style={{ position:'absolute', top:'.7rem', right:'.7rem', background:'rgba(255,255,255,.9)', border:`1px solid #f5c6cb`, borderRadius:'8px', width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} title="Remove profile">
                <Trash2 size={12} color="#c0392b"/>
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'1.3rem', flexShrink:0 }}>
                  {(p.fullName||'V')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:800, color:C.adText, fontSize:'1rem', marginBottom:'.15rem' }}>{p.fullName}</div>
                  <div style={{ fontSize:'.8rem', color:C.adMid }}>{p.occupation||'Volunteer'}</div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', background:`rgba(90,138,94,.1)`, border:`1px solid rgba(90,138,94,.2)`, borderRadius:'50px', padding:'.15rem .65rem', marginTop:'.3rem', fontSize:'.72rem', fontWeight:700, color:C.adAccent }}>
                    <CheckCircle size={10}/> Active Volunteer
                  </div>
                </div>
              </div>
            </div>

            {/* Profile body */}
            <div style={{ padding:'1.1rem 1.2rem' }}>
              {/* Contact row */}
              <div style={{ display:'flex', flexDirection:'column', gap:'.4rem', marginBottom:'.9rem' }}>
                {p.email && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.82rem' }}>
                    <Mail size={13} color={C.adAccent}/>
                    <a href={`mailto:${p.email}`} style={{ color:C.adAccent, textDecoration:'none', fontWeight:600 }}>{p.email}</a>
                  </div>
                )}
                {p.phone && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.82rem' }}>
                    <Phone size={13} color={C.adAccent}/>
                    <span style={{ color:C.adText, fontWeight:600 }}>{p.phone}</span>
                  </div>
                )}
                {p.age && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.82rem' }}>
                    <Calendar size={13} color={C.adAccent}/>
                    <span style={{ color:C.adText, fontWeight:600 }}>{p.age} years old</span>
                  </div>
                )}
              </div>

              {/* Availability */}
              {p.availability && (
                <div style={{ background:'#eef4ee', borderRadius:'8px', padding:'.5rem .8rem', marginBottom:'.8rem', fontSize:'.82rem', fontWeight:700, color:C.adAccent, display:'flex', alignItems:'center', gap:'.4rem' }}>
                  <span style={{ opacity:.7 }}>⏰</span> Available: <span style={{ textTransform:'capitalize' }}>{p.availability}</span>
                </div>
              )}

              {/* Areas */}
              {p.areas && p.areas.length > 0 && (
                <div style={{ marginBottom:'.9rem' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.4rem' }}>Skills / Areas</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.3rem' }}>
                    {(Array.isArray(p.areas)?p.areas:[p.areas]).map((area,idx)=>(
                      <span key={idx} style={{ background:`rgba(217,119,87,.1)`, border:`1px solid rgba(217,119,87,.25)`, borderRadius:'50px', padding:'.15rem .6rem', fontSize:'.75rem', fontWeight:700, color:'#c65d3f' }}>{area}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {p.notes && (
                <div style={{ marginBottom:'.9rem' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:C.adMid, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.3rem' }}>Notes</div>
                  <p style={{ fontSize:'.82rem', color:C.adText, margin:0, lineHeight:1.55, background:'#faf9f6', borderRadius:'8px', padding:'.6rem .8rem', border:`1px solid ${C.adBorder}` }}>{p.notes}</p>
                </div>
              )}

              {/* Approved date */}
              {p.approvedAt && (
                <div style={{ fontSize:'.75rem', color:C.adMid, marginBottom:'.9rem' }}>
                  Approved: {new Date(p.approvedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                </div>
              )}

              {/* Edit button */}
              <button onClick={()=>setEditingVolProfile({...p})} style={{ width:'100%', background:`linear-gradient(135deg,${C.adAccent},#3d6b41)`, color:'#fff', border:'none', borderRadius:'10px', padding:'.65rem', fontSize:'.85rem', fontWeight:700, cursor:'pointer', fontFamily:"'Crimson Pro',Georgia,serif", display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                Edit Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
 

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
          </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════════════ */
const AppRoot = () => {
  const [view, setView] = useState('app');
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser,   setAdminUser]   = useState(null);

  if (view === 'admin-auth') return <AdminLoginPage onAdminSuccess={u=>{setAdminUser(u);setView('admin-dash');}} onBackToUser={()=>setView('app')}/>;
  if (view === 'admin-dash') return <AdminDashboard adminUser={adminUser} onLogout={()=>{setAdminUser(null);setView('app');}}/>;

  return (
    <OrphanageWebsite
      currentUser={currentUser}
      onLogout={()=>{ setCurrentUser(null); localStorage.removeItem('ml_token'); }}
      onAdminLogin={()=>setView('admin-auth')}
      onAuthSuccess={u=>setCurrentUser(u)}
    />
  );
};
/* ══════════════════════════════════════════════════════════════════════
   HOME SLIDESHOW COMPONENT
══════════════════════════════════════════════════════════════════════ */
const HomeSlideshow = ({ photos = [] }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next');
  const [animating, setAnimating] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback((count) => {
    clearInterval(timerRef.current);
    if (count > 1) {
      timerRef.current = setInterval(() => {
        setDirection('next');
        setAnimating(true);
        setTimeout(() => { setCurrent(p => (p + 1) % count); setAnimating(false); }, 400);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    setCurrent(0);
    startTimer(photos.length);
    return () => clearInterval(timerRef.current);
  }, [photos.length, startTimer]);

  const goTo = (idx, dir) => {
    if (animating || photos.length <= 1) return;
    clearInterval(timerRef.current);
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); startTimer(photos.length); }, 400);
  };

  const prev = () => goTo((current - 1 + photos.length) % photos.length, 'prev');
  const next = () => goTo((current + 1) % photos.length, 'next');
  const onTouchStart = e => setDragStartX(e.touches[0].clientX);
  const onTouchEnd   = e => { const d = e.changedTouches[0].clientX - dragStartX; if (Math.abs(d) > 50) d < 0 ? next() : prev(); };

  if (photos.length === 0) {
    return (
      <div style={{ background:'linear-gradient(135deg,#f4e8de,#ead7c8)', borderRadius:'28px', padding:'3rem',
        boxShadow:'0 20px 60px rgba(0,0,0,.1)', border:`2px solid ${C.light}`, textAlign:'center',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        gap:'1rem', minHeight:'320px' }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(217,119,87,.15)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Heart size={32} color={C.primary} fill={C.primary} style={{ opacity:.6 }} />
        </div>
        <div>
          <div style={{ fontSize:'1.2rem', fontWeight:800, color:C.dark, marginBottom:'.3rem' }}>Making a Difference</div>
          <div style={{ fontSize:'.9rem', color:C.mid }}>Homepage photos managed by admin</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:'relative', borderRadius:'28px', overflow:'hidden',
  boxShadow:'0 20px 60px rgba(0,0,0,.15)', userSelect:'none', height:'480px', background:'#1a1008' }}>
      <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden',
        cursor: photos.length > 1 ? 'grab' : 'default' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img key={current} src={photos[current]} alt={`Slide ${current + 1}`}
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center', display:'block',
            animation: animating
              ? (direction==='next' ? 'slideOutLeft .4s ease forwards' : 'slideOutRight .4s ease forwards')
              : (direction==='next' ? 'slideInRight .4s ease forwards' : 'slideInLeft .4s ease forwards') }}
          draggable={false} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%',
          background:'linear-gradient(transparent,rgba(26,16,8,.6))', pointerEvents:'none' }}/>
        {photos.length > 1 && (
          <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(0,0,0,.45)',
            backdropFilter:'blur(6px)', borderRadius:'50px', padding:'.3rem .8rem',
            fontSize:'.8rem', fontWeight:700, color:'#fff' }}>
            {current + 1} / {photos.length}
          </div>
        )}
        {photos.length > 1 && <>
          <button onClick={prev} style={{ position:'absolute', left:'.8rem', top:'50%', transform:'translateY(-50%)',
            background:'rgba(255,255,255,.25)', backdropFilter:'blur(8px)',
            border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'40px', height:'40px',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            color:'#fff', fontSize:'1.1rem', fontWeight:800, zIndex:5 }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.45)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.25)'}>‹</button>
          <button onClick={next} style={{ position:'absolute', right:'.8rem', top:'50%', transform:'translateY(-50%)',
            background:'rgba(255,255,255,.25)', backdropFilter:'blur(8px)',
            border:'2px solid rgba(255,255,255,.4)', borderRadius:'50%', width:'40px', height:'40px',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            color:'#fff', fontSize:'1.1rem', fontWeight:800, zIndex:5 }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.45)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.25)'}>›</button>
        </>}
        {photos.length > 1 && (
          <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)',
            display:'flex', gap:'.4rem', zIndex:5 }}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                style={{ width:i===current?'20px':'7px', height:'7px', borderRadius:'50px',
                  background:i===current?'#fff':'rgba(255,255,255,.5)',
                  border:'none', cursor:'pointer', padding:0, transition:'all .3s', minHeight:'unset' }}/>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight  { from{transform:translateX(100%);opacity:0}  to{transform:translateX(0);opacity:1} }
        @keyframes slideInLeft   { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes slideOutLeft  { from{transform:translateX(0);opacity:1} to{transform:translateX(-60%);opacity:0} }
        @keyframes slideOutRight { from{transform:translateX(0);opacity:1} to{transform:translateX(60%);opacity:0} }
      `}</style>
    </div>
  );
};
/* ══════════════════════════════════════════════════════════════════════
   MAIN SITE
══════════════════════════════════════════════════════════════════════ */
const OrphanageWebsite = ({ currentUser, onLogout, onAdminLogin, onAuthSuccess }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [activeSection, setActiveSection] = useState('home');
  const [volunteerForm, setVolunteerForm] = useState({fullName:'',email:'',phone:'',age:'',occupation:'',availability:'weekends',areas:[],experience:'',motivation:''});
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);
  const [volunteerError, setVolunteerError]   = useState('');
  const [navOpen,       setNavOpen]       = useState(false);
  const [children,      setChildren]      = useState([]);
  const [donations,     setDonations]     = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [editingGender, setEditingGender] = useState({});
  const [appAlert,   setAppAlert]   = useState(null);
  const [appConfirm, setAppConfirm] = useState(null);
  const [sortOrder, setSortOrder]   = useState('default');
  const [ageMin, setAgeMin]         = useState('');
  const [ageMax, setAgeMax]         = useState('');
  const [ageRangeError, setAgeRangeError] = useState('');
  const [genderFilter, setGenderFilter]   = useState('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [tempDonationAmount, setTempDonationAmount] = useState(0);
  const [donorName, setDonorName] = useState('');
const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
const [donorPhone, setDonorPhone] = useState('+91-');
  const [sponsorChildId,   setSponsorChildId]   = useState(null);
  const [sponsorChildName, setSponsorChildName] = useState('');
  const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');
  const [customDonorName,   setCustomDonorName]   = useState('');
  const [customSubmitting,  setCustomSubmitting]  = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [thankYouDonorName, setThankYouDonorName] = useState('');
  const [thankYouAmount,    setThankYouAmount]    = useState(0);
  const [showSponsorModal,  setShowSponsorModal]  = useState(false);
  const [sponsorChild,      setSponsorChild]      = useState(null);
  const [sponsorAmountInput,setSponsorAmountInput]= useState('');
  const [sponsorDonorName,  setSponsorDonorName]  = useState('');
  const [sponsorError,      setSponsorError]      = useState('');
  const [sponsorSubmitting, setSponsorSubmitting] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adoptChild,     setAdoptChild]     = useState(null);
  const [adoptSubmitting,setAdoptSubmitting]= useState(false);
  const [adoptSuccess,   setAdoptSuccess]   = useState(false);
  const [adoptError,     setAdoptError]     = useState('');
  const [adoptForm, setAdoptForm] = useState({ applicantName:'', address:'', annualIncome:'', familyMembers:'', phone:'', email:'', reason:'' });
  const [expandedChildren, setExpandedChildren] = useState({});
  const [contactForm,       setContactForm]       = useState({ name:'', email:'', phone:'', message:'' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess,    setContactSuccess]    = useState(false);
  const [contactError,      setContactError]      = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [members, setMembers] = useState([]);
const [membersLoading, setMembersLoading] = useState(false);
const [homepageSlides, setHomepageSlides] = useState([]);
const [founderStoryData, setFounderStoryData] = useState(null);
  const [totalRaised, setTotalRaised]   = useState(0);
  const [donorCount,  setDonorCount]    = useState(0);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [donateTab, setDonateTab] = useState('money');
const [selectedDonateAmt, setSelectedDonateAmt] = useState('');
const [customDonateInput, setCustomDonateInput] = useState('');
const [selectedGoods, setSelectedGoods] = useState([]);
const [goodsOtherText, setGoodsOtherText] = useState('');
const [selectedVolAreas, setSelectedVolAreas] = useState([]);
const [volOtherText, setVolOtherText] = useState('');
const [goodsSuccess, setGoodsSuccess] = useState(false);
const [showGoodsModal, setShowGoodsModal] = useState(false);
const [goodsContactForm, setGoodsContactForm] = useState({ 
  name:'', email:'', phone:'', address:'', pincode:'', state:'', 
  quantity:'', foodType:'', foodExpiry:'', foodPackaged:'',
  clothingType:'', clothingAge:'', clothingGender:'', clothesWashed:'',
  bookType:'', bookAge:'', bookLanguage:'', bookCondition:'',
  toyType:'', toyAge:'', toyParts:'',
  hygieneItems:[], statItems:[],
  blanketType:'', blanketSize:'',
  footwearType:'', footwearSize:'',
  notes:'', condition:'new'
});
const [goodsSubmitting, setGoodsSubmitting] = useState(false);
const [goodsErrors, setGoodsErrors] = useState({});
  const [pendingDonationAction, setPendingDonationAction] = useState(null);

  const showAlert   = (type,title,message) => setAppAlert({type,title,message});
  const showConfirm = (message,onConfirm)  => setAppConfirm({message,onConfirm});

const fetchFounderStoryPublic = useCallback(async () => {
  try {
    const r = await apiFetch('/founder-story');
    if (r && typeof r === 'object') setFounderStoryData(r);
  } catch {
    try {
      const saved = JSON.parse(localStorage.getItem('ml_founder_story') || 'null');
      if (saved) setFounderStoryData(saved);
    } catch {}
  }
}, []);

  const fetchChildren = async () => {
    setLoading(true);
    try { const r = await apiFetch('/children'); setChildren(Array.isArray(r)?r:(r.children||[])); }
    catch { setChildren([{_id:'1',name:'Sarah',age:8,gender:'female',story:'Loves painting and dreams of becoming an artist',photo:'🎨'},{_id:'2',name:'Michael',age:10,gender:'male',story:'Passionate about science and wants to be a doctor',photo:'🔬'},{_id:'3',name:'Emma',age:6,gender:'female',story:'Enjoys reading and playing with friends',photo:'📚'},{_id:'4',name:'David',age:12,gender:'male',story:'Talented musician learning to play the guitar',photo:'🎸'},{_id:'5',name:'Sofia',age:7,gender:'female',story:'Loves animals and wants to be a veterinarian',photo:'🐾'},{_id:'6',name:'James',age:9,gender:'male',story:'Enjoys sports and dreams of becoming an athlete',photo:'⚽'}]); }
    setLoading(false);
  };
  const fetchHomepageSlides = async () => {
    try {
      const r = await apiFetch('/slides');
      const list = Array.isArray(r) ? r : (r.slides || []);
      setHomepageSlides(list.map(s => s.url).filter(Boolean));
    } catch {
      try {
        const saved = JSON.parse(localStorage.getItem('ml_slides') || '[]');
        setHomepageSlides(saved.map(s => s.url || s).filter(Boolean));
      } catch { setHomepageSlides([]); }
    }
  };
useEffect(() => {
  fetchChildren(); fetchDonations(); fetchMembers(); fetchHomepageSlides(); fetchFounderStoryPublic();
  const iv = setInterval(fetchDonations, 30000);
  return () => clearInterval(iv);
}, [fetchFounderStoryPublic]);
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
     const r = await apiFetch('/members');
      let list = Array.isArray(r) ? r : (r.members || []);
      // Sort by sortOrder field, then fall back to localStorage order
      try {
        const hasSortOrder = list.some(m => m.sortOrder !== undefined && m.sortOrder !== null && m.sortOrder !== '');
        if (hasSortOrder) {
          list = [...list].sort((a,b) => (parseInt(a.sortOrder)||999) - (parseInt(b.sortOrder)||999));
        } else {
          const savedOrder = JSON.parse(localStorage.getItem('ml_member_order') || '{}');
          if (Object.keys(savedOrder).length > 0) {
            list = [...list].sort((a,b) => (savedOrder[a._id]||999) - (savedOrder[b._id]||999));
          }
        }
      } catch {}
      setMembers(list);
    } catch {
      setMembers([
        { _id: 'm1', name: 'Dr. Anjali Sharma', role: 'Founder & Director', photo: '👩‍💼', bio: 'A passionate advocate for child welfare with over 20 years of experience in social work and nonprofit management.', email: 'anjali@makelife.org', phone: '+91 98765 00001', joinedYear: '2025' },
        { _id: 'm2', name: 'Ravi Menon', role: 'Program Coordinator', photo: '👨‍💻', bio: 'Manages day-to-day operations and coordinates education programs for children at MakeLife.', email: 'ravi@makelife.org', phone: '+91 98765 00002', joinedYear: '2025' },
        { _id: 'm3', name: 'Priya Nair', role: 'Child Counselor', photo: '👩‍⚕️', bio: 'Licensed psychologist specializing in childhood trauma and emotional development.', email: 'priya@makelife.org', phone: '+91 98765 00003', joinedYear: '2025' },
        { _id: 'm4', name: 'Samuel Iyer', role: 'Finance Manager', photo: '👨‍💼', bio: 'Oversees all financial planning, budgeting, and donor fund management for the organization.', email: 'samuel@makelife.org', phone: '+91 98765 00004', joinedYear: '2026' },
        { _id: 'm5', name: 'Deepa Krishnan', role: 'Education Head', photo: '👩‍🏫', bio: 'Designs and implements curriculum tailored to the unique needs of children at MakeLife.', email: 'deepa@makelife.org', phone: '+91 98765 00005', joinedYear: '2026' },
        { _id: 'm6', name: 'Arjun Bose', role: 'Medical Officer', photo: '👨‍⚕️', bio: 'Ensures the physical health and wellbeing of all children through regular checkups and medical care.', email: 'arjun@makelife.org', phone: '+91 98765 00006', joinedYear: '2026' },
      ]);
    }
    setMembersLoading(false);
  };

  const fetchDonations = async () => {
    try {
      const data = await apiFetch('/donations');
      const list = Array.isArray(data)?data:(data.donations||data.data||[]);
      setDonations(list); setDonorCount(list.length);
      setTotalRaised(list.reduce((s,d)=>s+(parseFloat(d.amount)||0),0));
    } catch {}
  };

  const addToTotal = amt => { const n=parseFloat(amt); if(!isNaN(n)&&n>0){setTotalRaised(p=>p+n);setDonorCount(p=>p+1);} };

  const requireLogin = (action) => {
    if (!currentUser) {
      setPendingDonationAction(() => action);
      setShowLoginGate(true);
      return false;
    }
    return true;
  };

  const handleLoginGateSuccess = (user) => {
    onAuthSuccess(user);
    setShowLoginGate(false);
    if (pendingDonationAction) {
      setTimeout(() => { pendingDonationAction(user); setPendingDonationAction(null); }, 150);
    }
  };

  const mn = ageMin!==''?parseInt(ageMin):null;
  const mx = ageMax!==''?parseInt(ageMax):null;
  const sortedChildren = [...children]
    .filter(c=>{
      if(mn!==null&&c.age<mn) return false;
      if(mx!==null&&c.age>mx) return false;
      if(genderFilter!=='all'){const g=(c.gender||'').toLowerCase();if(genderFilter==='male'&&g!=='male'&&g!=='boy')return false;if(genderFilter==='female'&&g!=='female'&&g!=='girl')return false;}
      return true;
    })
    .sort((a,b)=>sortOrder==='age-asc'?a.age-b.age:sortOrder==='age-desc'?b.age-a.age:0);

  const hasAgeFilter    = ageMin!==''||ageMax!=='';
  const hasGenderFilter = genderFilter!=='all';
  const isFilterActive  = hasAgeFilter||hasGenderFilter;
  const activeFilterCount = (hasAgeFilter?1:0)+(hasGenderFilter?1:0);
  const handleClearAll  = () => {setSortOrder('default');setAgeMin('');setAgeMax('');setAgeRangeError('');setGenderFilter('all');};
  const go = s => { setActiveSection(s); setNavOpen(false); setShowUserMenu(false); };

  // NOTE: deleteChild removed from user side — only admin can delete
const handleDonation = amt => {
    if (!requireLogin(() => { 
      setTempDonationAmount(amt); 
    setDonorName(currentUser?.name || '');
    setDonorEmail(currentUser?.email || '');
    setDonorPhone('+91-');
    setShowDonationModal(true); 
  })) return;
  setTempDonationAmount(amt);
  setDonorName(currentUser?.name || '');
  setDonorEmail(currentUser?.email || '');
  setDonorPhone('+91-');
  setShowDonationModal(true);
  };
const submitDonation = async () => {
  const effectiveName = (donorName.trim() || (currentUser?.name || '').trim());
  if (!effectiveName) {
    showAlert('error', 'Name Required', 'Please enter your name to complete the donation.');
    return;
  }
const dashIndex = donorPhone.indexOf('-');
  const phoneCode = dashIndex > -1 ? donorPhone.substring(0, dashIndex) : '+91';
  const phoneNum = dashIndex > -1 ? donorPhone.substring(dashIndex + 1).trim() : donorPhone.trim();

  if (!phoneNum || phoneNum.replace(/\D/g, '').length < 5) {
    showAlert('error', 'Phone Required', 'Please enter a valid phone number.');
    return;
  }

const effectiveEmail = (donorEmail || '').trim() || (currentUser?.email || '').trim();
  if (!effectiveEmail) {
    showAlert('error', 'Email Required', 'Please enter your email address.');
    return;
  }

  // ── Capture ALL values into local constants FIRST ──
  const name = effectiveName;
  const amt = tempDonationAmount;
  const cname = sponsorChildName;
  const childId = sponsorChildId;
  const capturedPhone = `${phoneCode}-${phoneNum}`;
  const capturedEmail = effectiveEmail;

  // ── Build payload immediately ──
  const donationData = {
    donorName:  name,
    amount:     amt,
    donorEmail: capturedEmail,
    donorPhone: capturedPhone,
    createdAt:  new Date().toISOString(),
  };
  if (childId) {
    donationData.childId = childId;
    donationData.childName = cname;
  }

  // ── Update UI optimistically ──
  addToTotal(amt);
  setShowDonationModal(false);
  setDonorName('');
  setDonorPhone('+91-');
  setDonorEmail('');
  setSponsorChildId(null);
  setSponsorChildName('');
  setTempDonationAmount(0);
  setThankYouDonorName(name);
  setThankYouAmount(amt);
  setSponsorChildName(cname);
  setShowThankYouModal(true);

  // ── Save to backend using already-captured local constants ──
  try {
    await apiFetch(`${process.env.REACT_APP_API_URL}/donations`, { method: 'POST', body: JSON.stringify(donationData) });
    fetchDonations();
  } catch(err) {
    console.error('Donation save failed:', err);
  }
};
  const handleSponsorChild = child => {
    if (!requireLogin((user) => { setSponsorChild(child); setSponsorAmountInput(''); setSponsorDonorName(user?.name||''); setSponsorError(''); setSponsorSubmitting(false); setShowSponsorModal(true); })) return;
    setSponsorChild(child); setSponsorAmountInput(''); 
    setSponsorDonorName(currentUser?.name||''); 
    setSponsorError(''); setSponsorSubmitting(false); setShowSponsorModal(true);
  };
  const closeSponsorModal = () => { setShowSponsorModal(false); setSponsorChild(null); setSponsorAmountInput(''); setSponsorDonorName(''); setSponsorError(''); setSponsorSubmitting(false); };

  const handleSponsorSubmit = async () => {
    const val=parseFloat(sponsorAmountInput);
    if(!sponsorAmountInput||isNaN(val)||val<=0){setSponsorError('Please enter a valid amount.');return;}
    if(!sponsorDonorName.trim()){setSponsorError('Please enter your name.');return;}
    setSponsorSubmitting(true);
    const name=sponsorDonorName.trim(); const cname=sponsorChild.name;
    addToTotal(val); closeSponsorModal();
    setThankYouDonorName(name); setThankYouAmount(val); setSponsorChildName(cname); setShowThankYouModal(true);
    const sponsorEmail = currentUser?.email || '';
    try {
      const savedPhone = localStorage.getItem('ml_user_phone') || '';
      await apiFetch(`${process.env.REACT_APP_API_URL}/donations`, {method:'POST',body:JSON.stringify({donorName:name,amount:val,childId:String(sponsorChild._id),childName:cname,donorEmail:sponsorEmail,donorPhone:savedPhone})});
      fetchDonations();
    } catch {}
    setSponsorSubmitting(false);
  };

  const openCustomAmountModal = () => {
    if (!requireLogin((user) => { setCustomAmountInput(''); setCustomAmountError(''); setCustomDonorName(user?.name||''); setCustomSubmitting(false); setShowCustomAmountModal(true); })) return;
    setCustomAmountInput(''); setCustomAmountError(''); 
    setCustomDonorName(currentUser?.name||''); 
    setCustomSubmitting(false); setShowCustomAmountModal(true);
  };
  const closeCustomAmountModal = () => { setShowCustomAmountModal(false); setCustomAmountInput(''); setCustomAmountError(''); setCustomDonorName(''); setCustomSubmitting(false); };

const handleCustomAmountSubmit = async () => {
  const val = parseFloat(customAmountInput);
  if (!customAmountInput || isNaN(val) || val <= 0) { setCustomAmountError('Please enter a valid amount.'); return; }
  if (!customDonorName.trim()) { setCustomAmountError('Please enter your name.'); return; }
  setCustomSubmitting(true);
  const name = customDonorName.trim();
  addToTotal(val); closeCustomAmountModal();
  setThankYouDonorName(name); setThankYouAmount(val); setSponsorChildName(''); setShowThankYouModal(true);
  try {
    const savedPhone = localStorage.getItem('ml_user_phone') || '';
    await apiFetch(`${process.env.REACT_APP_API_URL}/donations`, { method: 'POST', body: JSON.stringify({ donorName: name, amount: val, donorEmail: currentUser?.email || '', donorPhone: savedPhone }) });
    fetchDonations();
  } catch {}
};
  
  const handleAdoptClick = child => { setAdoptChild(child); setAdoptForm({applicantName:'',address:'',annualIncome:'',familyMembers:'',phone:'',email:'',reason:''}); setAdoptSuccess(false); setAdoptError(''); setShowAdoptModal(true); };
  const closeAdoptModal  = () => { setShowAdoptModal(false); setAdoptChild(null); setAdoptSuccess(false); setAdoptError(''); };
  const handleAdoptFormChange = e => { const {name,value}=e.target; setAdoptForm(p=>({...p,[name]:value})); };
  const handleAdoptSubmit = async e => {
    e.preventDefault(); setAdoptSubmitting(true);
    try {
      const payload={childId:String(adoptChild._id),childName:adoptChild.name,...adoptForm,annualIncome:parseFloat(adoptForm.annualIncome),familyMembers:parseInt(adoptForm.familyMembers)};
      await apiFetch(`${process.env.REACT_APP_API_URL}/adoptions',{method:'POST',body:JSON.stringify(payload)});
      setAdoptSuccess(true);
    } catch(err) { setAdoptError(err.message); }
    finally { setAdoptSubmitting(false); }
  };

  const handleContactChange = e => { const {name,value}=e.target; setContactForm(p=>({...p,[name]:value})); };
  const handleContactSubmit = async e => {
    e.preventDefault(); setContactSubmitting(true); setContactError(''); setContactSuccess(false);
    try {
      await apiFetch(`${process.env.REACT_APP_API_URL}/contact``,{method:'POST',body:JSON.stringify(contactForm)});
      setContactSuccess(true); setTimeout(()=>setContactSuccess(false),4000);
      setContactForm({name:'',email:'',phone:'',message:''});
    } catch(err) { setContactError(err.message.includes('fetch')||err.message.includes('Network')?'NETWORK_ERROR':err.message); }
    finally { setContactSubmitting(false); }
  };

  const maxW = { maxWidth:'1400px', margin:'0 auto', padding: isMobile?'0 1.1rem':isTablet?'0 1.5rem':'0 2rem' };
  const sP   = isMobile?'2rem 1.1rem':isTablet?'2.5rem 1.5rem':'3.5rem 2rem';
  const fi   = e => { e.target.style.borderColor=C.primary; e.target.style.boxShadow='0 0 0 3px rgba(217,119,87,.12)'; };
  const fo   = e => { e.target.style.borderColor=C.light; e.target.style.boxShadow='none'; };
  const NAVLINKS = ['Home','Children','Members','Volunteer','Donate','Contact'];
  const initials = (currentUser?.name||'G').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(180deg,${C.bg},#fef9f6)` , fontFamily:"'Crimson Pro',Georgia,serif"  }}>

      {showLoginGate && (
        <LoginGateModal
          onClose={() => { setShowLoginGate(false); setPendingDonationAction(null); }}
          onAuthSuccess={handleLoginGateSuccess}
          onAdminLogin={onAdminLogin}
        />
      )}

      {showDonationModal && (
        <Overlay onClose={()=>{setShowDonationModal(false);setDonorName('');setDonorPhone('+91-');setDonorEmail('');setSponsorChildId(null);setSponsorChildName('');setTempDonationAmount(0);}}>
          <ModalCard>
            <MH isMobile={isMobile}><CloseBtn onClick={()=>{setShowDonationModal(false);setDonorName('');setDonorPhone('+91-');setDonorEmail('');setSponsorChildId(null);setSponsorChildName('');setTempDonationAmount(0);}}/><h3 style={{fontSize:'1.7rem',fontWeight:700,color:'#fff',margin:0}}>{sponsorChildId?`Sponsor ${sponsorChildName}`:'Complete Donation'}</h3></MH>
            <MB isMobile={isMobile}>
  <p style={{textAlign:'center',color:C.mid,fontSize:'1.05rem',marginBottom:'1.2rem'}}>
    Amount: <strong style={{color:C.primary,fontSize:'1.5rem'}}>Rs. {tempDonationAmount}</strong>
  </p>

  <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.9rem'}}>
    Full Name <span style={{color:'#e63946'}}>*</span>
  </label>
<input type="text" placeholder="Enter your name" 
    value={donorName}
    onChange={e => setDonorName(e.target.value)}
    style={{...inputBase,marginBottom:'1rem'}} onFocus={fi} onBlur={fo}/>

 <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.9rem'}}>
  Phone Number <span style={{color:'#e63946'}}>*</span>
</label>
<div style={{display:'flex',gap:'.5rem',marginBottom:'1.2rem'}}>
  <select 
    value={donorPhone.split('-')[0]||'+91'}
    onChange={e=>{
      const num=donorPhone.split('-')[1]||'';
      setDonorPhone(e.target.value+'-'+num);
    }}
    style={{...inputBase,width:'140px',flexShrink:0,padding:'.9rem .5rem',fontSize:'.85rem',cursor:'pointer'}}
    onFocus={fi} onBlur={fo}>
    {[
      {code:'+91',label:'🇮🇳 +91'},
      {code:'+1',label:'🇺🇸 +1'},
      {code:'+44',label:'🇬🇧 +44'},
      {code:'+61',label:'🇦🇺 +61'},
      {code:'+971',label:'🇦🇪 +971'},
      {code:'+65',label:'🇸🇬 +65'},
      {code:'+60',label:'🇲🇾 +60'},
      {code:'+966',label:'🇸🇦 +966'},
      {code:'+974',label:'🇶🇦 +974'},
      {code:'+49',label:'🇩🇪 +49'},
      {code:'+33',label:'🇫🇷 +33'},
      {code:'+81',label:'🇯🇵 +81'},
      {code:'+86',label:'🇨🇳 +86'},
      {code:'+55',label:'🇧🇷 +55'},
      {code:'+27',label:'🇿🇦 +27'},
    ].map(c=>(
      <option key={c.code} value={c.code}>{c.label}</option>
    ))}
  </select>
  <input 
    type="tel" 
    placeholder="10-digit number" 
    value={donorPhone.split('-')[1]||''}
    onChange={e=>{
      const digits=e.target.value.replace(/\D/g,'').slice(0,10);
      const code=donorPhone.split('-')[0]||'+91';
      setDonorPhone(code+'-'+digits);
    }}
    style={{...inputBase,flex:1}} 
    onFocus={fi} onBlur={fo}
    maxLength={10}
  />
</div>
<label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.9rem'}}>
  Email Address <span style={{color:'#e63946'}}>*</span>
</label>
<input
  type="email"
  placeholder="your@email.com"
  value={donorEmail || (currentUser?.email || '')}
  onChange={e => setDonorEmail(e.target.value)}
  style={{...inputBase, marginBottom:'1.2rem'}}
  onFocus={fi} onBlur={fo}
/>

  <div style={{display:'flex',gap:'.8rem'}}>
    <button onClick={submitDonation} style={{...btnP,flex:1,justifyContent:'center'}}>Donate Now</button>
    <button onClick={()=>{setShowDonationModal(false);setDonorName('');setDonorPhone('+91-');setDonorEmail('');setSponsorChildId(null);setSponsorChildName('');setTempDonationAmount(0);}} style={{...btnO,padding:'.9rem 1.2rem'}}>Cancel</button>
  </div>
</MB>
          </ModalCard>
        </Overlay>
      )}
      {showCustomAmountModal && (
        <Overlay onClose={closeCustomAmountModal}>
          <ModalCard>
            <MH isMobile={isMobile}><CloseBtn onClick={closeCustomAmountModal}/><h3 style={{fontSize:'1.7rem',fontWeight:800,color:'#fff',margin:'0 0 .3rem'}}>Custom Donation</h3><p style={{color:'rgba(255,255,255,.85)',fontSize:'.95rem',margin:0}}>Every rupee makes a difference</p></MH>
            <MB isMobile={isMobile}>
              <QuickPicks value={customAmountInput} onSelect={v=>{setCustomAmountInput(v);setCustomAmountError('');}}/>
              <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.5rem'}}>Donation Amount (Rs.)</label>
              <div style={{position:'relative',marginBottom:'1.2rem'}}><span style={{position:'absolute',left:'1.1rem',top:'50%',transform:'translateY(-50%)',fontSize:'1.2rem',fontWeight:700,color:C.primary,pointerEvents:'none'}}>₹</span><input type="number" min="1" placeholder="e.g. 1000" value={customAmountInput} onChange={e=>{setCustomAmountInput(e.target.value);setCustomAmountError('');}} autoFocus style={{...inputBase,paddingLeft:'3rem',fontSize:'1.2rem',fontWeight:700}} onFocus={fi} onBlur={fo}/></div>
              <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.5rem'}}>Your Name</label>
              <input type="text" placeholder="Enter your full name" value={customDonorName || (currentUser?.name||'')} onChange={e=>{setCustomDonorName(e.target.value);setCustomAmountError('');}} style={{...inputBase,marginBottom:customAmountError?'.5rem':'1.2rem'}} onFocus={fi} onBlur={fo}/>
              {customAmountError && <p style={{color:'#c0392b',fontSize:'.9rem',fontWeight:600,margin:'0 0 1rem'}}>⚠️ {customAmountError}</p>}
              <div style={{display:'flex',gap:'.8rem'}}><button onClick={closeCustomAmountModal} style={{...btnO,borderColor:C.light,color:C.mid,padding:'.9rem 1.2rem'}}>Cancel</button><button onClick={handleCustomAmountSubmit} disabled={customSubmitting} style={{...btnP,flex:1,justifyContent:'center',background:customSubmitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:customSubmitting?'not-allowed':'pointer',boxShadow:'none'}}>{customSubmitting?'Processing…':'Donate Now'}</button></div>
            </MB>
          </ModalCard>
        </Overlay>
      )}
      {showThankYouModal && (
        <Overlay onClose={()=>{setShowThankYouModal(false);setSponsorChildName('');}}>
          <ModalCard maxWidth={460}>
            <div style={{padding:isMobile?'3rem 2rem 2.5rem':'3.8rem 3.2rem 3rem',textAlign:'center',background:C.white,borderRadius:'24px'}}>
              <h3 style={{fontSize:isMobile?'2rem':'2.4rem',fontWeight:800,color:C.dark,margin:'0 0 1.4rem'}}>Thank You!</h3>
              <p style={{fontSize:isMobile?'1rem':'1.1rem',color:C.mid,lineHeight:1.9,margin:'0 0 2.2rem'}}>
                <strong style={{color:C.primary}}>{thankYouDonorName}</strong>
                {sponsorChildName?(<>, your sponsorship of <strong style={{color:C.primary}}>Rs. {fmt(thankYouAmount)}</strong> for <strong style={{color:C.primary}}>{sponsorChildName}</strong> will truly change their life!</>):(<>, your donation of <strong style={{color:C.primary}}>Rs. {fmt(thankYouAmount)}</strong> will make a real difference!</>)}
              </p>
              <button onClick={()=>{setShowThankYouModal(false);setSponsorChildName('');}} style={{...btnP,justifyContent:'center',padding:'.9rem 3.2rem',fontSize:'1.05rem',borderRadius:'50px'}}>Close</button>
            </div>
          </ModalCard>
        </Overlay>
      )}
      {showSponsorModal && sponsorChild && (
        <Overlay onClose={closeSponsorModal}>
          <ModalCard>
            <MH isMobile={isMobile}><CloseBtn onClick={closeSponsorModal}/><div style={{marginBottom:'.6rem'}}>{isValidUrl(sponsorChild.photo)?<img src={getPhotoSrc(sponsorChild.photo)} alt={sponsorChild.name} style={{width:'60px',height:'60px',borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,.5)'}}/>:<div style={{fontSize:'2.8rem'}}>{isEmoji(sponsorChild.photo)?sponsorChild.photo:'👶'}</div>}</div><h3 style={{fontSize:'1.7rem',fontWeight:800,color:'#fff',margin:'0 0 .3rem'}}>Sponsor {sponsorChild.name}</h3><p style={{color:'rgba(255,255,255,.85)',fontSize:'.95rem',margin:0}}>Age {sponsorChild.age} · Every rupee helps</p></MH>
            <MB isMobile={isMobile}>
              <QuickPicks value={sponsorAmountInput} onSelect={v=>{setSponsorAmountInput(v);setSponsorError('');}}/>
              <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.5rem'}}>Sponsorship Amount (Rs.)</label>
              <div style={{position:'relative',marginBottom:'1.2rem'}}><span style={{position:'absolute',left:'1.1rem',top:'50%',transform:'translateY(-50%)',fontSize:'1.2rem',fontWeight:700,color:C.primary,pointerEvents:'none'}}>₹</span><input type="number" min="1" placeholder="e.g. 1000" value={sponsorAmountInput} onChange={e=>{setSponsorAmountInput(e.target.value);setSponsorError('');}} autoFocus style={{...inputBase,paddingLeft:'3rem',fontSize:'1.2rem',fontWeight:700}} onFocus={fi} onBlur={fo}/></div>
              <label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.5rem'}}>Your Name</label>
             <input type="text" placeholder="Enter your full name" value={sponsorDonorName || (currentUser?.name||'')} onChange={e=>{setSponsorDonorName(e.target.value);setSponsorError('');}} style={{...inputBase,marginBottom:sponsorError?'.5rem':'1.2rem'}} onFocus={fi} onBlur={fo}/>
              {sponsorError&&<p style={{color:'#c0392b',fontSize:'.9rem',fontWeight:600,margin:'0 0 1rem'}}>⚠️ {sponsorError}</p>}
              <div style={{display:'flex',gap:'.8rem'}}><button onClick={closeSponsorModal} style={{...btnO,borderColor:C.light,color:C.mid,padding:'.9rem 1.2rem'}}>Cancel</button><button onClick={handleSponsorSubmit} disabled={sponsorSubmitting} style={{...btnP,flex:1,justifyContent:'center',background:sponsorSubmitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:sponsorSubmitting?'not-allowed':'pointer',boxShadow:'none'}}>{sponsorSubmitting?'Processing…':`Sponsor ${sponsorChild.name}`}</button></div>
            </MB>
          </ModalCard>
        </Overlay>
      )}
      {showAdoptModal && adoptChild && (
        <Overlay onClose={closeAdoptModal}>
          <ModalCard maxWidth={600}>
            {adoptSuccess?(
              <div style={{padding:'3.5rem 3rem',textAlign:'center'}}>
                <h3 style={{fontSize:'2rem',fontWeight:700,color:C.dark,marginBottom:'1rem'}}>Application Submitted!</h3>
                <p style={{fontSize:'1.05rem',color:C.mid,lineHeight:1.7,marginBottom:'1.8rem'}}>Thank you <strong>{adoptForm.applicantName}</strong>! We'll contact you in 7–10 days.</p>
                <button onClick={closeAdoptModal} style={{...btnP,justifyContent:'center'}}>Close</button>
              </div>
            ):(
              <>
                <MH isMobile={isMobile}><CloseBtn onClick={closeAdoptModal}/><h3 style={{fontSize:'1.7rem',fontWeight:700,color:'#fff',margin:0}}>Adopt {adoptChild.name}</h3><p style={{color:'rgba(255,255,255,.85)',margin:'.4rem 0 0',fontSize:'.95rem'}}>Fill in your details to apply</p></MH>
                <MB isMobile={isMobile}>
                  <form onSubmit={handleAdoptSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                    <input type="text" name="applicantName" placeholder="Full Name *" value={adoptForm.applicantName} onChange={handleAdoptFormChange} required style={inputBase} onFocus={fi} onBlur={fo}/>
                    <textarea name="address" placeholder="Home Address *" value={adoptForm.address} onChange={handleAdoptFormChange} required rows="3" style={{...inputBase,resize:'vertical'}} onFocus={fi} onBlur={fo}/>
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
                      <input type="number" name="annualIncome" placeholder="Annual Income (Rs.) *" value={adoptForm.annualIncome} onChange={handleAdoptFormChange} required min="0" style={inputBase} onFocus={fi} onBlur={fo}/>
                      <input type="number" name="familyMembers" placeholder="Family Members *" value={adoptForm.familyMembers} onChange={handleAdoptFormChange} required min="1" style={inputBase} onFocus={fi} onBlur={fo}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
  <input type="tel" name="phone" placeholder="Phone *" value={adoptForm.phone} onChange={handleAdoptFormChange} required style={inputBase} onFocus={fi} onBlur={fo}/>
  <input type="email" name="email" placeholder="Email *" value={adoptForm.email} onChange={handleAdoptFormChange} required style={inputBase} onFocus={fi} onBlur={fo}/>
</div>
                    <textarea name="reason" placeholder={`Why adopt ${adoptChild.name}? *`} value={adoptForm.reason} onChange={handleAdoptFormChange} required rows="4" style={{...inputBase,resize:'vertical'}} onFocus={fi} onBlur={fo}/>
                    {adoptError&&<div style={{background:'#fff0f0',border:'2px solid #f5c6cb',borderRadius:'12px',padding:'.9rem 1.1rem',color:'#c0392b',fontWeight:700}}>⚠️ {adoptError}</div>}
                    <div style={{display:'flex',gap:'.8rem'}}><button type="submit" disabled={adoptSubmitting} style={{...btnP,flex:1,justifyContent:'center',background:adoptSubmitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:adoptSubmitting?'not-allowed':'pointer',boxShadow:'none'}}>{adoptSubmitting?'Submitting…':'Submit Application'}</button><button type="button" onClick={closeAdoptModal} style={{...btnO,padding:'.9rem 1.2rem'}}>Cancel</button></div>
                  </form>
                </MB>
              </>
            )}
          </ModalCard>
        </Overlay>
      )}
      {appAlert && (
        <Overlay onClose={()=>setAppAlert(null)}>
          <ModalCard maxWidth={420}>
            <div style={{padding:'3.5rem 3.2rem 3rem',textAlign:'center'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'50%',margin:'0 auto 1.5rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',background:appAlert.type==='success'?'linear-gradient(135deg,#2a7d4f,#48bb78)':appAlert.type==='error'?'linear-gradient(135deg,#c0392b,#e74c3c)':'linear-gradient(135deg,#d97757,#c65d3f)',color:'#fff'}}>{appAlert.type==='success'?'✓':appAlert.type==='error'?'✕':'!'}</div>
              <h3 style={{fontSize:'1.9rem',fontWeight:800,color:C.dark,margin:'0 0 .8rem'}}>{appAlert.title}</h3>
              <p style={{fontSize:'1.05rem',color:C.mid,lineHeight:1.75,margin:'0 0 2rem'}}>{appAlert.message}</p>
              <button onClick={()=>setAppAlert(null)} style={{...btnP,justifyContent:'center',padding:'.9rem 3rem',fontSize:'1.05rem',background:appAlert.type==='success'?'linear-gradient(135deg,#2a7d4f,#48bb78)':appAlert.type==='error'?'linear-gradient(135deg,#c0392b,#e74c3c)':'linear-gradient(135deg,#d97757,#c65d3f)',boxShadow:'none'}}>OK</button>
            </div>
          </ModalCard>
        </Overlay>
      )}
      {appConfirm && (
        <Overlay onClose={()=>setAppConfirm(null)}>
          <ModalCard maxWidth={420}>
            <div style={{padding:'3.5rem 3.2rem 3rem',textAlign:'center'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'50%',margin:'0 auto 1.5rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.7rem',background:'linear-gradient(135deg,#e67e22,#f39c12)',color:'#fff'}}>?</div>
              <h3 style={{fontSize:'1.9rem',fontWeight:800,color:C.dark,margin:'0 0 .8rem'}}>Are you sure?</h3>
              <p style={{fontSize:'1.05rem',color:C.mid,lineHeight:1.75,margin:'0 0 2rem'}}>{appConfirm.message}</p>
              <div style={{display:'flex',gap:'.9rem',justifyContent:'center'}}>
                <button onClick={()=>setAppConfirm(null)} style={{...btnO,padding:'.9rem 2rem'}}>Cancel</button>
                <button onClick={()=>{appConfirm.onConfirm();setAppConfirm(null);}} style={{...btnP,justifyContent:'center',padding:'.9rem 2rem',background:'linear-gradient(135deg,#c0392b,#e74c3c)',boxShadow:'none'}}>Delete</button>
              </div>
            </div>
          </ModalCard>
        </Overlay>
      )}

      {/* NAVIGATION */}
      <nav style={{position:'sticky',top:0,background:'rgba(255,255,255,.97)',backdropFilter:'blur(14px)',borderBottom:`2px solid ${C.light}`,zIndex:1000,boxShadow:'0 4px 20px rgba(0,0,0,.07)'}}>
        <div style={{...maxW,display:'flex',justifyContent:'space-between',alignItems:'center',padding:isMobile?'.9rem 1.1rem':'1.1rem 2rem'}}>
          <div onClick={()=>go('home')} style={{display:'flex',alignItems:'center',gap:'.7rem',cursor:'pointer'}}>
            <Heart style={{color:C.primary,width:isMobile?'34px':'44px',height:isMobile?'34px':'44px',flexShrink:0}} fill={C.primary}/>
            <div>
              <div style={{margin:0,fontSize:isMobile?'1.55rem':'2.2rem',fontWeight:800,color:C.primary,letterSpacing:'-.02em',lineHeight:1}}>MakeLife</div>
              {!isMobile&&<div style={{margin:0,fontSize:'.82rem',color:'#8b6f5c',fontStyle:'italic'}}>Nurturing Dreams, Building Futures</div>}
            </div>
          </div>

          {!isTablet && (
            <div style={{display:'flex',gap:'2rem',alignItems:'center'}}>
              {NAVLINKS.map(s=>(
                <button key={s} onClick={()=>go(s.toLowerCase())} style={{background:'none',border:'none',fontSize:'1.1rem',fontWeight:activeSection===s.toLowerCase()?700:500,color:activeSection===s.toLowerCase()?C.primary:'#4a3428',cursor:'pointer',padding:'.4rem 0',borderBottom:activeSection===s.toLowerCase()?`3px solid ${C.primary}`:'3px solid transparent',transition:'all .25s',fontFamily:"'Crimson Pro',Georgia,serif"}}>{s}</button>
              ))}

              {currentUser ? (
                <div style={{position:'relative'}}>
                  <button onClick={()=>setShowUserMenu(p=>!p)} style={{display:'flex',alignItems:'center',gap:'.5rem',background:showUserMenu?'#fff3ee':C.white,border:`2px solid ${showUserMenu?C.primary:C.light}`,borderRadius:'50px',padding:'.4rem .9rem .4rem .4rem',cursor:'pointer',transition:'all .2s',fontFamily:"'Crimson Pro',Georgia,serif"}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#d97757,#c65d3f)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'.82rem',flexShrink:0}}>{initials}</div>
                    <span style={{fontSize:'.9rem',fontWeight:600,color:C.dark,maxWidth:'110px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{currentUser?.name||'User'}</span>
                    <span style={{fontSize:'.55rem',color:C.mid}}>▼</span>
                  </button>
                  {showUserMenu && (
                    <div style={{position:'absolute',top:'calc(100% + .5rem)',right:0,background:C.white,border:`2px solid ${C.light}`,borderRadius:'16px',boxShadow:'0 12px 40px rgba(44,24,16,.15)',minWidth:'200px',overflow:'hidden',animation:'popIn .2s ease',zIndex:200}}>
                      <div style={{padding:'1rem 1.2rem',borderBottom:`1px solid ${C.light}`}}>
                        <div style={{fontWeight:800,color:C.dark,fontSize:'.95rem'}}>{currentUser?.name||'User'}</div>
                        <div style={{fontSize:'.8rem',color:C.mid,marginTop:'.15rem'}}>{currentUser?.email}</div>
                      </div>
                      <button onClick={()=>{setShowUserMenu(false);onLogout();}} style={{display:'flex',alignItems:'center',gap:'.6rem',width:'100%',textAlign:'left',background:'none',border:'none',padding:'1rem 1.2rem',fontSize:'.95rem',fontWeight:600,color:'#c0392b',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}} onMouseEnter={e=>e.currentTarget.style.background='#fff0f0'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                        <LogOut size={16}/> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{position:'relative'}}>
                  <NavLoginDropdown onAuthSuccess={onAuthSuccess} onAdminLogin={onAdminLogin} />
                </div>
              )}
            </div>
          )}

          {isTablet && (
            <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
              {currentUser ? (
                <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#d97757,#c65d3f)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'.78rem',flexShrink:0,cursor:'pointer'}} onClick={()=>setShowUserMenu(p=>!p)}>{initials}</div>
              ) : (
                <div style={{position:'relative'}}>
                  <NavLoginDropdown onAuthSuccess={onAuthSuccess} onAdminLogin={onAdminLogin} />
                </div>
              )}
              <button onClick={()=>setNavOpen(o=>!o)} style={{background:navOpen?'#fff3ee':C.white,border:`2px solid ${navOpen?C.primary:C.light}`,borderRadius:'12px',padding:'.5rem .6rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:navOpen?C.primary:'#4a3428',transition:'all .2s'}}>{navOpen?<X size={22}/>:<Menu size={22}/>}</button>
            </div>
          )}
        </div>

        {isTablet && navOpen && (
          <div style={{background:C.white,borderTop:`2px solid ${C.light}`,paddingBottom:'.5rem',animation:'slideDown .2s ease'}}>
            {NAVLINKS.map(s=>(<button key={s} onClick={()=>go(s.toLowerCase())} style={{display:'block',width:'100%',textAlign:'left',background:activeSection===s.toLowerCase()?'#fff3ee':'none',border:'none',fontSize:'1.1rem',fontWeight:activeSection===s.toLowerCase()?700:500,color:activeSection===s.toLowerCase()?C.primary:'#4a3428',cursor:'pointer',padding:'.9rem 1.5rem',fontFamily:"'Crimson Pro',Georgia,serif",borderLeft:activeSection===s.toLowerCase()?`4px solid ${C.primary}`:'4px solid transparent',transition:'all .2s'}}>{s}</button>))}
            {currentUser && (
              <div style={{borderTop:`1px solid ${C.light}`,padding:'.6rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div><div style={{fontSize:'.88rem',fontWeight:700,color:C.dark}}>{currentUser?.name}</div><div style={{fontSize:'.75rem',color:C.mid}}>{currentUser?.email}</div></div>
                <button onClick={()=>{setNavOpen(false);onLogout();}} style={{display:'flex',alignItems:'center',gap:'.4rem',background:'#fff0f0',border:'none',borderRadius:'50px',padding:'.5rem .9rem',fontSize:'.88rem',fontWeight:700,color:'#c0392b',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}><LogOut size={14}/> Sign Out</button>
              </div>
            )}
          </div>
        )}
        {isTablet && showUserMenu && !navOpen && currentUser && (
          <div style={{position:'absolute',top:'100%',right:'1rem',background:C.white,border:`2px solid ${C.light}`,borderRadius:'16px',boxShadow:'0 12px 40px rgba(44,24,16,.15)',minWidth:'190px',overflow:'hidden',animation:'popIn .2s ease',zIndex:200}}>
            <div style={{padding:'.9rem 1.1rem',borderBottom:`1px solid ${C.light}`}}><div style={{fontWeight:800,color:C.dark,fontSize:'.95rem'}}>{currentUser?.name}</div><div style={{fontSize:'.78rem',color:C.mid}}>{currentUser?.email}</div></div>
            <button onClick={()=>{setShowUserMenu(false);onLogout();}} style={{display:'flex',alignItems:'center',gap:'.6rem',width:'100%',textAlign:'left',background:'none',border:'none',padding:'.9rem 1.1rem',fontSize:'.95rem',fontWeight:600,color:'#c0392b',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}><LogOut size={16}/> Sign Out</button>
          </div>
        )}
      </nav>
      {showUserMenu && <div onClick={()=>setShowUserMenu(false)} style={{position:'fixed',inset:0,zIndex:99}}/>}

      {/* HOME */}
      {activeSection==='home' && (
  <div style={{animation:'fadeIn .6s ease-in'}}>
    <section style={{maxWidth:'1400px',margin:'0 auto',padding:isMobile?'2.5rem 1.1rem':'3.5rem 2rem'}}>
      <div style={{display:'grid',gridTemplateColumns:isMobile||isTablet?'1fr':'1.2fr 1fr',gap:isMobile?'2rem':'4rem',alignItems:'center'}}>
        <div>
          {currentUser && <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:'#fff8f4',border:`2px solid ${C.light}`,borderRadius:'50px',padding:'.4rem 1rem',marginBottom:'1rem',fontSize:'.9rem',color:C.mid,fontWeight:600}}>👋 Welcome, <strong style={{color:C.primary}}>{currentUser.name}</strong>!</div>}
          <h2 style={{fontSize:isMobile?'2.2rem':isTablet?'2.8rem':'4.2rem',fontWeight:800,lineHeight:1.05,marginBottom:'.8rem',color:C.dark,letterSpacing:'-.03em'}}>Every Child Deserves a <span style={{color:C.primary}}>Loving Home</span></h2>
          <p style={{fontSize:isMobile?'1.05rem':'1.2rem',lineHeight:1.8,color:'#5a463a',marginBottom:'1.5rem'}}>At MakeLife, we provide a safe, nurturing environment where children can grow, learn, and thrive.</p>
          <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
            <button onClick={()=>go('donate')} style={btnP}>Make a Donation</button>
            <button onClick={()=>go('children')} style={btnO}>Meet Our Children <ChevronRight size={18}/></button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:isMobile?'1rem':'1.5rem',padding:isMobile?'1.2rem':'1.8rem',background:'rgba(255,255,255,.8)',borderRadius:'18px',border:`2px solid ${C.light}`}}>
            {[[`${children.length}+`,'Children Helped'],[`${donorCount}`,'Active Donors'],['11','Months of Service']].map(([n,l],i)=>(<div key={i} style={{textAlign:'center'}}><div style={{fontSize:isMobile?'1.7rem':'2.2rem',fontWeight:800,color:C.primary}}>{n}</div><div style={{color:C.mid,fontSize:isMobile?'.75rem':'.9rem',fontWeight:600}}>{l}</div></div>))}
          </div>
        </div>
        {!isMobile && <HomeSlideshow photos={homepageSlides} />}
      </div>
    </section>

    {/* ── OUR STORY ── */}
<section style={{background:'linear-gradient(135deg,#f4e8de,#ead7c8)',padding:isMobile?'3rem 1.1rem':'4rem 2rem'}}>
  <div style={{maxWidth:'1100px',margin:'0 auto'}}>
    <h2 style={{fontSize:isMobile?'1.9rem':'3rem',fontWeight:700,textAlign:'center',marginBottom:'2rem',color:C.dark}}>Our Story</h2>

    <div style={{background:'rgba(255,255,255,.85)',padding:isMobile?'1.8rem 1.5rem':'3rem',borderRadius:'24px',boxShadow:'0 12px 40px rgba(0,0,0,.09)',border:`3px solid ${C.light}`,marginBottom:'2.5rem'}}>

      {/* ── Founder row — only shown when admin has set founder data ── */}
      {(founderStoryData?.founderName || founderStoryData?.founderPhoto) && (
        <div style={{
          display:'flex',
          flexDirection:isMobile?'column':'row',
          gap:isMobile?'1.5rem':'2.5rem',
          alignItems:'flex-start',
          marginBottom:'2.2rem',
          paddingBottom:'2.2rem',
          borderBottom:`2px solid ${C.light}`
        }}>
          {/* Photo */}
          <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:isMobile?'center':'flex-start'}}>
            {founderStoryData.founderPhoto ? (
              <img
                src={founderStoryData.founderPhoto.startsWith('/uploads/')
                  ? `${process.env.REACT_APP_API_URL}${founderStoryData.founderPhoto}`
                  : founderStoryData.founderPhoto}
                alt={founderStoryData.founderName || 'Founder'}
                style={{
  width:isMobile?'160px':'260px',
  height:isMobile?'190px':'320px',
  objectFit:'cover',
  objectPosition:'center top',
  borderRadius:'16px',
  border:`3px solid ${C.light}`,
  boxShadow:'0 8px 28px rgba(0,0,0,.12)',
  display:'block'
}}
              />
            ) : (
              <div style={{
                width:isMobile?'160px':'260px',
                height:isMobile?'190px':'320px',
                borderRadius:'16px',
                background:'#f0e4d7',
                border:`3px solid ${C.light}`,
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}>
                <User size={52} color={C.primary} style={{opacity:.3}}/>
              </div>
            )}
          </div>

          {/* Founder info */}
          <div style={{flex:1}}>
            <div style={{
              fontSize:isMobile?'1.9rem':'2.4rem',
              fontWeight:800,
              color:C.primary,
              marginBottom:'.25rem',
              fontFamily:"'Crimson Pro',Georgia,serif"
            }}>
              {founderStoryData.founderName}
            </div>
            {founderStoryData.founderRole && (
              <div style={{
                fontSize:isMobile?'1.1rem':'1.25rem',
                color:C.mid,
                fontWeight:600,
                marginBottom:'1rem',
                fontStyle:'italic'
              }}>
                {founderStoryData.founderRole}
              </div>
            )}
            {founderStoryData.founderBio && (
              <p style={{
                fontSize:isMobile?'1rem':'1.1rem',
                lineHeight:1.9,
                color:'#5a463a',
                margin:0
              }}>
                {founderStoryData.founderBio}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Orphanage story paragraphs ── */}
      {[
        founderStoryData?.story1 || 'Founded in 2025, MakeLife has been a beacon of hope for children who have lost their parents or been abandoned.',
        founderStoryData?.story2 || 'Our mission is simple yet profound: to provide every child with a safe, loving environment where they can heal, grow, and discover their full potential.',
        founderStoryData?.story3 || 'Through dedicated staff, generous donors, and community support, we have created more than just an orphanage — we have built a family.',
      ].map((text,i) => (
        <p key={i} style={{
          fontSize:isMobile?'1.05rem':'1.2rem',
          lineHeight:1.9,
          color:'#5a463a',
          marginBottom:i<2?'1.1rem':0
        }}>
          {text}
        </p>
      ))}
    </div>

    {/* ── Stats row ── */}
    <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:isMobile?'1rem':'1.5rem'}}>
      {[
        ['11','Months',<Calendar size={isMobile?28:36}/>],
        [`${children.length}+`,'Children',<Users size={isMobile?28:36}/>],
        ['25','Staff',<HandHeart size={isMobile?28:36}/>],
        ['95%','Success',<Heart size={isMobile?28:36}/>]
      ].map(([n,l,icon],i) => (
        <div key={i} style={{
          background:'rgba(255,255,255,.9)',
          padding:isMobile?'1.5rem 1rem':'2rem',
          borderRadius:'18px',
          textAlign:'center',
          border:`2px solid ${C.light}`,
          boxShadow:'0 4px 16px rgba(0,0,0,.06)'
        }}>
          <div style={{color:C.primary,marginBottom:'.6rem',display:'flex',justifyContent:'center'}}>{icon}</div>
          <div style={{fontSize:isMobile?'1.8rem':'2.2rem',fontWeight:800,color:C.primary,marginBottom:'.3rem'}}>{n}</div>
          <div style={{fontSize:isMobile?'.8rem':'.95rem',color:C.mid,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>
  </div>
</section>

    {/* ── HOW WE MAKE A DIFFERENCE (moved down) ── */}
    <section style={{maxWidth:'1400px',margin:'0 auto',padding:isMobile?'0 1.1rem 3rem':'0 2rem 4rem'}}>
      <h3 style={{fontSize:isMobile?'1.7rem':'2.6rem',fontWeight:700,textAlign:'center',marginBottom:'2rem',color:C.dark}}>How We Make a Difference</h3>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:isMobile?'1rem':'2rem'}}>
        {[{icon:<Home size={isMobile?30:40}/>,title:'Safe Housing',desc:'Comfortable spaces where children feel secure'},{icon:<BookOpen size={isMobile?30:40}/>,title:'Education',desc:'Access to excellent schools and resources'},{icon:<Gift size={isMobile?30:40}/>,title:'Healthcare',desc:'Comprehensive medical & mental health support'},{icon:<Users size={isMobile?30:40}/>,title:'Community',desc:'Strong bonds with peers, mentors, staff'},{icon:<HandHeart size={isMobile?30:40}/>,title:'Life Skills',desc:'Programs for independent living'},{icon:<Heart size={isMobile?30:40}/>,title:'Emotional Care',desc:'Counseling and nurturing relationships'}].map((f,i)=>(
          <div key={i} style={{background:C.white,padding:isMobile?'1.2rem 1rem':'2rem',borderRadius:'20px',boxShadow:'0 8px 30px rgba(0,0,0,.07)',border:`2px solid ${C.light}`,textAlign:'center'}}>
            <div style={{color:C.primary,marginBottom:'.7rem',display:'flex',justifyContent:'center'}}>{f.icon}</div>
            <h4 style={{fontSize:isMobile?'.95rem':'1.2rem',fontWeight:700,marginBottom:isMobile?0:'.5rem',color:C.dark}}>{f.title}</h4>
            {!isMobile && <p style={{fontSize:'.95rem',color:C.mid,lineHeight:1.6,margin:0}}>{f.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  </div>
)}
      {/* CHILDREN — NO delete button for users */}
      {activeSection==='children' && (
        <div style={{animation:'fadeIn .6s ease-in'}}>
          <section style={{maxWidth:'1400px',margin:'0 auto',padding:sP}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',gap:'1rem',flexWrap:'wrap'}}>
              <div><h2 style={{fontSize:isMobile?'1.8rem':isTablet?'2.4rem':'3rem',fontWeight:700,color:C.dark,marginBottom:'.3rem'}}>Meet Our Beautiful Children</h2><p style={{fontSize:isMobile?'1rem':'1.1rem',color:C.mid,margin:0}}>Each child has a unique story and dreams waiting to be realized.</p></div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <div style={{position:'relative'}}>
                  <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)} style={{...inputBase,padding:'.6rem 2.6rem .6rem 1rem',fontSize:'.95rem',fontWeight:600,background:sortOrder!=='default'?'#fff3ee':C.white,borderColor:sortOrder!=='default'?C.primary:C.light,color:sortOrder!=='default'?C.primary:C.dark,cursor:'pointer',minWidth:isMobile?'135px':'165px',borderRadius:'50px',width:'auto'}}>
                    <option value="default">Default Order</option>
                    <option value="age-asc">Youngest First</option>
                    <option value="age-desc">Oldest First</option>
                  </select>
                </div>
              </div>
              <button onClick={()=>setShowFilterPanel(p=>!p)} style={{display:'flex',alignItems:'center',gap:'.4rem',background:showFilterPanel||isFilterActive?'linear-gradient(135deg,#d97757,#c65d3f)':C.white,color:showFilterPanel||isFilterActive?C.white:C.dark,border:`2px solid ${showFilterPanel||isFilterActive?C.primary:C.light}`,borderRadius:'50px',padding:'.6rem 1.1rem',fontSize:'.95rem',fontWeight:700,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>
                Filters {activeFilterCount>0 && <span style={{background:'rgba(255,255,255,.3)',border:'1.5px solid rgba(255,255,255,.6)',borderRadius:'50%',width:'20px',height:'20px',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:800}}>{activeFilterCount}</span>}
              </button>
              <div style={{flex:1}}/>
              {(isFilterActive||sortOrder!=='default') && <button onClick={handleClearAll} style={{background:C.white,border:`2px solid ${C.light}`,borderRadius:'50px',padding:'.5rem 1rem',fontSize:'.9rem',fontWeight:700,color:'#8b6f5c',cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>✕ Clear</button>}
            </div>
            {showFilterPanel && (
              <div style={{background:C.white,border:`2px solid ${C.light}`,borderRadius:'18px',padding:'1.8rem 2rem',marginBottom:'1.2rem',boxShadow:'0 6px 24px rgba(0,0,0,.08)',animation:'popIn .22s ease'}}>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'2rem'}}>
                  <div>
                    <label style={{fontSize:'1rem',fontWeight:700,color:'#4a3428',display:'block',marginBottom:'.8rem'}}>Age Range</label>
                    <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                      <input type="number" min="1" max="18" placeholder="1" value={ageMin} onChange={e=>{setAgeMin(e.target.value);setAgeRangeError('');}} style={{...inputBase,padding:'.85rem .6rem',fontSize:'1.15rem',fontWeight:700,textAlign:'center'}} onFocus={fi} onBlur={fo}/>
                      <span style={{color:'#8b6f5c',fontWeight:800,fontSize:'1.3rem'}}>–</span>
                      <input type="number" min="1" max="18" placeholder="18" value={ageMax} onChange={e=>{setAgeMax(e.target.value);setAgeRangeError('');}} style={{...inputBase,padding:'.85rem .6rem',fontSize:'1.15rem',fontWeight:700,textAlign:'center'}} onFocus={fi} onBlur={fo}/>
                    </div>
                    {ageRangeError && <div style={{marginTop:'.4rem',fontSize:'.85rem',color:'#c0392b',fontWeight:600}}>⚠️ {ageRangeError}</div>}
                  </div>
                  <div>
                    <label style={{fontSize:'1rem',fontWeight:700,color:'#4a3428',display:'block',marginBottom:'.8rem'}}>Gender</label>
                    <div style={{display:'flex',gap:'.7rem'}}>
                      {[{value:'all',label:'All'},{value:'male',label:'Boys'},{value:'female',label:'Girls'}].map(opt=>{
                        const isActive=genderFilter===opt.value;
                        return <button key={opt.value} onClick={()=>setGenderFilter(opt.value)} style={{flex:1,padding:'.75rem .3rem',borderRadius:'14px',border:`2.5px solid ${isActive?C.primary:C.light}`,background:isActive?'#fff3ee':'#fafafa',color:isActive?C.primary:C.mid,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif",fontWeight:isActive?800:600,fontSize:'.95rem'}}>{opt.label}</button>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div style={{textAlign:'center',padding:'4rem',fontSize:'1.3rem',color:'#8b6f5c'}}>Loading children's profiles…</div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':isTablet?'repeat(2,1fr)':'repeat(3,1fr)',gap:isMobile?'1.2rem':'2rem'}}>
                {sortedChildren.map(child=>(
                  <div key={child._id} style={{background:C.white,borderRadius:'22px',overflow:'hidden',boxShadow:'0 8px 30px rgba(0,0,0,.09)',border:`2px solid ${C.light}`,position:'relative'}}>
                    {/* ── NO delete button here — admin only ── */}
                  <div style={{background:'#f4e8de',height:isMobile?'300px':'360px',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:`2px solid ${C.light}`,overflow:'hidden',borderRadius:'20px 20px 0 0'}}>
  {isValidUrl(child.photo)
    ? <img src={getPhotoSrc(child.photo)} alt={child.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 15%',display:'block',padding:'0'}}/>
    : <div style={{fontSize:isMobile?'4rem':'5rem'}}>{isEmoji(child.photo)?child.photo:''}</div>
  }
</div>
                    <div style={{padding:isMobile?'1.2rem':'1.6rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.3rem'}}>
                        <h3 style={{fontSize:isMobile?'1.2rem':'1.4rem',fontWeight:700,color:C.dark,margin:0,flex:1}}>{child.name}</h3>
                        {(()=>{const g=(child.gender||'').toLowerCase();const isGirl=g==='girl'||g==='female';const isBoy=g==='boy'||g==='male';return(isBoy||isGirl)&&!editingGender[child._id]?(<span style={{fontSize:'.75rem',fontWeight:700,color:isGirl?'#c2185b':'#1565c0',background:isGirl?'#fce4ec':'#e3f2fd',borderRadius:'50px',padding:'.15rem .7rem'}}>{isGirl?'Girl':'Boy'}</span>):null;})()}
                      </div>
                      <p style={{fontSize:'.88rem',color:'#8b6f5c',margin:'0 0 .8rem',fontWeight:600}}>Age {child.age} yrs</p>
                      {expandedChildren[child._id] && (
                        <div style={{animation:'fadeIn .3s ease',marginBottom:'.6rem'}}>
                          <p style={{fontSize:'.95rem',color:C.mid,lineHeight:1.65,marginBottom:'.8rem'}}>{child.story}</p>
                        </div>
                      )}
                      {child.isAdopted && <div style={{background:'#d4edda',color:'#155724',border:'2px solid #c3e6cb',borderRadius:'16px',padding:'.35rem .8rem',fontSize:'.88rem',fontWeight:700,textAlign:'center',marginBottom:'.7rem'}}> Adopted</div>}
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',marginTop:'.9rem'}}>
                        <button onClick={()=>setExpandedChildren(p=>({...p,[child._id]:!p[child._id]}))} style={{background:'#f4e8de',color:'#4a3428',border:`2px solid ${C.light}`,padding:'.65rem .3rem',borderRadius:'40px',fontSize:isMobile?'.83rem':'.9rem',fontWeight:700,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>{expandedChildren[child._id]?'Hide':'Profile'}</button>
                        <button onClick={()=>handleSponsorChild(child)} style={{background:C.primary,color:C.white,border:'none',padding:'.65rem .3rem',borderRadius:'40px',fontSize:isMobile?'.83rem':'.9rem',fontWeight:700,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>Sponsor</button>
                        <button onClick={()=>!child.isAdopted&&handleAdoptClick(child)} disabled={child.isAdopted} style={{gridColumn:'1 / -1',background:child.isAdopted?'#f0f0f0':C.white,color:child.isAdopted?'#999':'#2a7d4f',border:`2px solid ${child.isAdopted?'#ccc':'#2a7d4f'}`,padding:'.65rem .3rem',borderRadius:'40px',fontSize:isMobile?'.83rem':'.9rem',fontWeight:700,cursor:child.isAdopted?'not-allowed':'pointer',fontFamily:"'Crimson Pro',Georgia,serif",opacity:child.isAdopted?.6:1}}>{child.isAdopted?'Adopted':'Adopt'}</button>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedChildren.length===0 && !loading && <div style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:C.mid}}>No children match your filters. <button onClick={handleClearAll} style={{background:'none',border:'none',color:C.primary,fontWeight:700,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>Clear filters</button></div>}
              </div>
            )}
          </section>
        </div>
      )}
   {/* MEMBERS */}
{activeSection==='members' && (
  <div style={{animation:'fadeIn .6s ease-in'}}>
    <section style={{maxWidth:'1400px',margin:'0 auto',padding:sP}}>
      <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
        <h2 style={{fontSize:isMobile?'1.8rem':isTablet?'2.4rem':'3rem',fontWeight:700,color:C.dark,marginBottom:'.4rem'}}>Our Associated Members</h2>
        <p style={{fontSize:isMobile?'1rem':'1.15rem',color:C.mid,margin:0}}>Meet the dedicated people behind MakeLife who work tirelessly for our children.</p>
      </div>
      {membersLoading ? (
        <div style={{textAlign:'center',padding:'4rem',fontSize:'1.3rem',color:'#8b6f5c'}}>Loading members…</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          {members.map(member=>(
            <div key={member._id}
              style={{
                display:'flex',
                flexDirection:isMobile?'column':'row',
                alignItems:'flex-start',
                gap:isMobile?'1.2rem':'2rem',
                background:'#fdf3e3',
                borderRadius:'12px',
                padding:isMobile?'1.5rem':'2rem 2.5rem',
                border:'1px solid #ecdcc0',
                transition:'box-shadow .2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,.09)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
            >
              <div style={{flexShrink:0,display:'flex',justifyContent:isMobile?'center':'flex-start',alignSelf:'stretch'}}>
                {isValidUrl(member.photo)
                  ?<img src={getPhotoSrc(member.photo)} alt={member.name} style={{width:isMobile?'140px':'220px',height:isMobile?'170px':'100%',objectFit:'cover',objectPosition:'center top',borderRadius:'8px',display:'block'}}/>
:<div style={{width:isMobile?'140px':'220px',height:isMobile?'170px':'480px',borderRadius:'8px',background:'linear-gradient(135deg,#e8d5b7,#d4b896)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile?'3rem':'3.5rem',fontWeight:700,color:'#a0522d'}}>
                    {isEmoji(member.photo)?member.photo:(member.name||'M')[0].toUpperCase()}
                  </div>
                }
              </div>
              <div style={{flex:1,minWidth:0}}>
                <h3 style={{fontSize:isMobile?'1.9rem':'2.6rem',fontWeight:800,color:'#1a1008',margin:'0 0 1.1rem',lineHeight:1.15,fontFamily:"'Crimson Pro',Georgia,serif"}}>
                  {member.name}
                  {member.role&&<span style={{fontWeight:400,color:'#555',fontSize:isMobile?'1.5rem':'2rem'}}> – {member.role}</span>}
                </h3>
                <div style={{fontSize:isMobile?'1.15rem':'1.3rem',color:'#333',lineHeight:1.9,marginBottom:'1.2rem'}}>
                  {(member.bio||'').split('\n').map((para,i)=>
                    para.trim()?<p key={i} style={{margin:'0 0 1rem'}}>{para.trim()}</p>:null
                  )}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'1.2rem',marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid #e8d5b7'}}>
                  {member.email&&<span style={{display:'flex',alignItems:'center',gap:'.5rem',fontSize:'1rem',color:'#555'}}><Mail size={16} color={C.primary}/>{member.email}</span>}
                  {member.joinedYear&&<span style={{display:'flex',alignItems:'center',gap:'.5rem',fontSize:'1rem',color:'#555'}}><Calendar size={16} color={C.primary}/>Member since {member.joinedYear}</span>}
                </div>
              </div>
            </div>
          ))}
          {members.length===0&&!membersLoading&&<div style={{textAlign:'center',padding:'3rem',color:C.mid,fontSize:'1.1rem'}}>No members found.</div>}
        </div>
      )}
    </section>
  </div>
)}

      {/* DONATE */}
{activeSection === 'donate' && (
  <div style={{ animation: 'fadeIn .6s ease-in' }}>
    <section style={{ maxWidth: '900px', margin: '0 auto', padding: sP }}>

      {/* ── Header ── */}
      <h2 style={{ fontSize: isMobile ? '1.9rem' : '3rem', fontWeight: 700, textAlign: 'center', marginBottom: '.4rem', color: C.dark }}>
        Make a Difference Today
      </h2>
      <p style={{ fontSize: '1.1rem', textAlign: 'center', color: C.mid, marginBottom: '2rem' }}>
        Choose how you'd like to help
      </p>

      {/* ── Goods Schedule Modal ── */}
{showGoodsModal && (
  <Overlay onClose={() => setShowGoodsModal(false)}>
    <ModalCard maxWidth={560}>
      <MH isMobile={isMobile}>
        <CloseBtn onClick={() => setShowGoodsModal(false)} />
        <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}></div>
        <h3 style={{ color: '#fff', margin: '0 0 .25rem', fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Crimson Pro',Georgia,serif" }}>
          Schedule Your Donation
        </h3>
        <p style={{ color: 'rgba(255,255,255,.85)', margin: 0, fontSize: '.9rem' }}>
          Items: {selectedGoods.map(g => g === 'other' ? (goodsOtherText || 'Other') : g).join(', ')}
        </p>
      </MH>
      <MB isMobile={isMobile}>
        {goodsSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '.8rem' }}></div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.dark, margin: '0 0 .6rem' }}>Thank You!</h3>
            <p style={{ color: C.mid, lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We've received your request. Our team will contact you within 24 hours to arrange the drop-off or pickup.
            </p>
           <button
  onClick={() => {
    setShowGoodsModal(false);
    setGoodsSuccess(false);
    setSelectedGoods([]);
    setGoodsOtherText('');
    setGoodsErrors({});
    setGoodsContactForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      state: '',
      quantity: '',
      foodType: '',
      foodExpiry: '',
      foodPackaged: '',
      clothingType: '',
      clothingAge: '',
      clothingGender: '',
      clothesWashed: '',
      bookType: '',
      bookAge: '',
      bookLanguage: '',
      bookCondition: '',
      toyType: '',
      toyAge: '',
      toyParts: '',
      hygieneItems: [],
      statItems: [],
      blanketType: '',
      blanketSize: '',
      footwearType: '',
      footwearSize: '',
      notes: '',
      condition: 'new',
    });
  }}
  style={{ ...btnP, justifyContent: 'center' }}
>
  Done
</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Drop-off info */}
            <div style={{ background: '#fff8f4', border: `1.5px dashed ${C.light}`, borderRadius: '12px', padding: '.9rem 1.1rem', fontSize: '.88rem', color: C.mid, lineHeight: 1.6 }}>
              📍 Drop-off: 123 Hope Street · Mon–Sat, 9am–5pm<br />
              🚚 Or we'll arrange a free pickup at your location
            </div>

            {/* ── Personal Details ── */}
            <div style={{ fontWeight: 800, color: C.dark, fontSize: '1rem', borderBottom: `2px solid ${C.light}`, paddingBottom: '.5rem' }}>
              👤 Your Details
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>Full Name *</label>
                <input type="text" placeholder="Your full name" value={goodsContactForm.name}
                    onChange={e => { setGoodsContactForm(p => ({ ...p, name: e.target.value })); setGoodsErrors(p=>({...p,name:''})); }}
                    style={{...inputBase, borderColor: goodsErrors.name ? '#e63946' : undefined}} onFocus={fi} onBlur={fo} />
                  <FieldError msg={goodsErrors.name} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>Email *</label>
                <input type="email" placeholder="you@example.com" value={goodsContactForm.email}
                    onChange={e => { setGoodsContactForm(p => ({ ...p, email: e.target.value })); setGoodsErrors(p=>({...p,email:''})); }}
                    style={{...inputBase, borderColor: goodsErrors.email ? '#e63946' : undefined}} onFocus={fi} onBlur={fo} />
                  <FieldError msg={goodsErrors.email} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>Phone Number</label>
                <input type="tel" maxLength="10" placeholder="10-digit mobile number" value={goodsContactForm.phone}
                  onChange={e => setGoodsContactForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  style={inputBase} onFocus={fi} onBlur={fo} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>State *</label>
                <select value={goodsContactForm.state}
                  onChange={e => setGoodsContactForm(p => ({ ...p, state: e.target.value }))}
                  style={{ ...inputBase, cursor: 'pointer' }} onFocus={fi} onBlur={fo}>
                  <option value="">Select State</option>
                  {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman & Nicobar','Chandigarh','Dadra & Nagar Haveli','Daman & Diu','Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                  <FieldError msg={goodsErrors.state} />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>Full Address *</label>
              <textarea rows="3" placeholder="House/Flat No., Street, Area, Landmark…"
                value={goodsContactForm.address}
                onChange={e => { setGoodsContactForm(p => ({ ...p, address: e.target.value })); setGoodsErrors(p=>({...p,address:''})); }}
                style={{ ...inputBase, resize: 'vertical', borderColor: goodsErrors.address ? '#e63946' : undefined }} onFocus={fi} onBlur={fo} />
              <FieldError msg={goodsErrors.address} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>PIN Code *</label>
                <input type="text" placeholder="e.g. 831001" maxLength={6}
                  value={goodsContactForm.pincode}
                  onChange={e => { setGoodsContactForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g,'') })); setGoodsErrors(p=>({...p,pincode:''})); }}
                  style={{...inputBase, borderColor: goodsErrors.pincode ? '#e63946' : undefined}} onFocus={fi} onBlur={fo} />
                <FieldError msg={goodsErrors.pincode} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>Condition of Items *</label>
                <select value={goodsContactForm.condition}
                  onChange={e => setGoodsContactForm(p => ({ ...p, condition: e.target.value }))}
                  style={{ ...inputBase, cursor: 'pointer' }} onFocus={fi} onBlur={fo}>
                  <option value="new">Brand New</option>
                  <option value="like-new">Like New (used once or twice)</option>
                  <option value="good">Good Condition</option>
                  <option value="fair">Fair Condition (minor wear)</option>
                </select>
              </div>
            </div>

            {/* ── Item-specific Details ── */}
            <div style={{ fontWeight: 800, color: C.dark, fontSize: '1rem', borderBottom: `2px solid ${C.light}`, paddingBottom: '.5rem', marginTop: '.3rem' }}>
               Item Details
            </div>

            {/* Quantity */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>
                Approximate Quantity / Amount *
                <span style={{ fontWeight: 400, color: C.mid, fontSize: '.8rem', marginLeft: '.4rem' }}>(e.g. "5 kg rice", "3 bags of clothes", "10 books")</span>
              </label>
              <input type="text" placeholder="Describe quantity for each item…"
                value={goodsContactForm.quantity}
                onChange={e => { setGoodsContactForm(p => ({ ...p, quantity: e.target.value })); setGoodsErrors(p=>({...p,quantity:''})); }}
                style={{...inputBase, borderColor: goodsErrors.quantity ? '#e63946' : undefined}} onFocus={fi} onBlur={fo} />
              <FieldError msg={goodsErrors.quantity} />
            </div>

            {/* Food-specific */}
            {selectedGoods.includes('food') && (
              <div style={{ background: '#fffbf4', border: `1.5px solid #f5e6c8`, borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                   Food Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Food Type *</label>
                    <select value={goodsContactForm.foodType}
                      onChange={e => setGoodsContactForm(p => ({ ...p, foodType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select food type</option>
                      <optgroup label="Grains & Cereals">
                        <option value="rice">Rice</option>
                        <option value="wheat">Wheat / Atta</option>
                        <option value="dal">Dal / Lentils</option>
                        <option value="poha">Poha / Flattened Rice</option>
                        <option value="oats">Oats / Cereals</option>
                        <option value="semolina">Semolina / Rava</option>
                      </optgroup>
                      <optgroup label="Packaged / Ready Foods">
                        <option value="biscuits">Biscuits / Cookies</option>
                        <option value="namkeen">Namkeen / Snacks</option>
                        <option value="noodles">Noodles / Pasta</option>
                        <option value="ready-to-eat">Ready-to-Eat Meals</option>
                        <option value="canned">Canned / Tinned Food</option>
                      </optgroup>
                      <optgroup label="Condiments & Spices">
                        <option value="oil">Cooking Oil</option>
                        <option value="sugar">Sugar / Jaggery</option>
                        <option value="salt">Salt</option>
                        <option value="spices">Spices / Masala</option>
                        <option value="tea-coffee">Tea / Coffee</option>
                      </optgroup>
                      <optgroup label="Nutrition">
                        <option value="milk-powder">Milk Powder / Horlicks</option>
                        <option value="protein">Protein / Health Supplements</option>
                        <option value="baby-food">Baby Food / Cerelac</option>
                      </optgroup>
                      <option value="mixed">Mixed / Assorted</option>
                      <option value="other-food">Other (mention in quantity)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Expiry / Best Before</label>
                    <input type="date" value={goodsContactForm.foodExpiry || ''}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setGoodsContactForm(p => ({ ...p, foodExpiry: e.target.value }))}
                      style={{ ...inputBase, fontSize: '.9rem' }} onFocus={fi} onBlur={fo} />
                  </div>
                  <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Is it Packaged / Sealed? *</label>
                    <div style={{ display: 'flex', gap: '.7rem' }}>
                      {['Yes – Factory sealed', 'Yes – Home packed', 'No – Loose / Open'].map(opt => (
                        <button key={opt} type="button"
                          onClick={() => setGoodsContactForm(p => ({ ...p, foodPackaged: opt }))}
                          style={{
                            flex: 1, padding: '.6rem .3rem', borderRadius: '12px', border: `2px solid ${goodsContactForm.foodPackaged === opt ? C.primary : C.light}`,
                            background: goodsContactForm.foodPackaged === opt ? '#fff3ee' : C.white,
                            color: goodsContactForm.foodPackaged === opt ? C.primary : C.mid,
                            fontWeight: goodsContactForm.foodPackaged === opt ? 800 : 600,
                            cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", fontSize: '.8rem'
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clothes-specific */}
            {selectedGoods.includes('clothes') && (
              <div style={{ background: '#f4f8ff', border: '1.5px solid #c8d8f5', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}> Clothing Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Type of Clothing *</label>
                    <select value={goodsContactForm.clothingType}
                      onChange={e => setGoodsContactForm(p => ({ ...p, clothingType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select type</option>
                      <option value="tops">Tops / T-Shirts / Shirts</option>
                      <option value="bottoms">Bottoms / Pants / Skirts</option>
                      <option value="dresses">Dresses / Frocks</option>
                      <option value="winter">Winter Wear (Jackets / Sweaters)</option>
                      <option value="uniforms">School Uniforms</option>
                      <option value="innerwear">Innerwear / Socks</option>
                      <option value="mixed">Mixed Assortment</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Age Group *</label>
                    <select value={goodsContactForm.clothingAge || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, clothingAge: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select age group</option>
                      <option value="0-2">Infant (0–2 years)</option>
                      <option value="3-5">Toddler (3–5 years)</option>
                      <option value="6-9">Child (6–9 years)</option>
                      <option value="10-14">Pre-teen (10–14 years)</option>
                      <option value="15-18">Teen (15–18 years)</option>
                      <option value="mixed-age">Mixed Ages</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Gender</label>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      {['Boys', 'Girls', 'Unisex'].map(opt => (
                        <button key={opt} type="button"
                          onClick={() => setGoodsContactForm(p => ({ ...p, clothingGender: opt }))}
                          style={{
                            flex: 1, padding: '.6rem .3rem', borderRadius: '12px', border: `2px solid ${goodsContactForm.clothingGender === opt ? C.primary : C.light}`,
                            background: goodsContactForm.clothingGender === opt ? '#fff3ee' : C.white,
                            color: goodsContactForm.clothingGender === opt ? C.primary : C.mid,
                            fontWeight: goodsContactForm.clothingGender === opt ? 800 : 600,
                            cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", fontSize: '.85rem'
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Are they washed & clean?</label>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      {['Yes', 'No'].map(opt => (
                        <button key={opt} type="button"
                          onClick={() => setGoodsContactForm(p => ({ ...p, clothesWashed: opt }))}
                          style={{
                            flex: 1, padding: '.6rem .3rem', borderRadius: '12px', border: `2px solid ${goodsContactForm.clothesWashed === opt ? C.primary : C.light}`,
                            background: goodsContactForm.clothesWashed === opt ? '#fff3ee' : C.white,
                            color: goodsContactForm.clothesWashed === opt ? C.primary : C.mid,
                            fontWeight: goodsContactForm.clothesWashed === opt ? 800 : 600,
                            cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", fontSize: '.9rem'
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books-specific */}
            {selectedGoods.includes('books') && (
              <div style={{ background: '#f4fff8', border: '1.5px solid #b8e8c8', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}> Book Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Book Type *</label>
                    <select value={goodsContactForm.bookType}
                      onChange={e => setGoodsContactForm(p => ({ ...p, bookType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select type</option>
                      <option value="textbooks">School Textbooks</option>
                      <option value="storybooks">Storybooks / Fiction</option>
                      <option value="activity">Activity / Colouring Books</option>
                      <option value="reference">Reference / Encyclopaedia</option>
                      <option value="religious">Moral / Religious</option>
                      <option value="mixed-books">Mixed / Assorted</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Target Age Group</label>
                    <select value={goodsContactForm.bookAge || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, bookAge: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select age</option>
                      <option value="3-6">3–6 years (Picture books)</option>
                      <option value="7-10">7–10 years</option>
                      <option value="11-14">11–14 years</option>
                      <option value="15-18">15–18 years</option>
                      <option value="all-ages">All ages</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Language</label>
                    <select value={goodsContactForm.bookLanguage || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, bookLanguage: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select language</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="regional">Regional Language</option>
                      <option value="bilingual">Bilingual</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Condition</label>
                    <select value={goodsContactForm.bookCondition || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, bookCondition: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select condition</option>
                      <option value="new">New / Unused</option>
                      <option value="good">Good – minimal marks</option>
                      <option value="fair">Fair – some writing inside</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Toys-specific */}
            {selectedGoods.includes('toys') && (
              <div style={{ background: '#fff8f0', border: '1.5px solid #fad9b0', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}> Toy Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Toy Type *</label>
                    <select value={goodsContactForm.toyType || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, toyType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select type</option>
                      <option value="soft-toys">Soft / Plush Toys</option>
                      <option value="board-games">Board Games / Puzzles</option>
                      <option value="educational">Educational Toys</option>
                      <option value="outdoor">Outdoor / Sports Toys</option>
                      <option value="building">Building Blocks / LEGO</option>
                      <option value="dolls">Dolls / Action Figures</option>
                      <option value="art-craft">Art & Craft Kits</option>
                      <option value="mixed-toys">Mixed Assortment</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Suitable Age Group *</label>
                    <select value={goodsContactForm.toyAge || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, toyAge: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select age</option>
                      <option value="0-3">0–3 years (infant safe)</option>
                      <option value="3-6">3–6 years</option>
                      <option value="6-10">6–10 years</option>
                      <option value="10-plus">10+ years</option>
                      <option value="all-ages">All ages</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Are all parts intact? Any missing pieces?</label>
                    <input type="text" placeholder="e.g. Complete set, missing 2 puzzle pieces, battery not included…"
                      value={goodsContactForm.toyParts || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, toyParts: e.target.value }))}
                      style={inputBase} onFocus={fi} onBlur={fo} />
                  </div>
                </div>
              </div>
            )}

            {/* Hygiene-specific */}
            {selectedGoods.includes('hygiene') && (
              <div style={{ background: '#f0f8ff', border: '1.5px solid #b0d4f5', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}>🧴 Hygiene Kit Details</div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.5rem', fontSize: '.85rem' }}>Select items included:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {['Soap', 'Shampoo', 'Toothbrush', 'Toothpaste', 'Comb', 'Sanitary Pads', 'Hand Sanitizer', 'Face Mask', 'Nail Cutter', 'Towel'].map(item => {
                      const hygieneItems = goodsContactForm.hygieneItems || [];
                      const isSelected = hygieneItems.includes(item);
                      return (
                        <button key={item} type="button"
                          onClick={() => setGoodsContactForm(p => ({
                            ...p, hygieneItems: isSelected ? hygieneItems.filter(h => h !== item) : [...hygieneItems, item]
                          }))}
                          style={{
                            padding: '.4rem .9rem', borderRadius: '20px', border: `2px solid ${isSelected ? C.primary : C.light}`,
                            background: isSelected ? '#fff3ee' : C.white, color: isSelected ? C.primary : C.mid,
                            fontWeight: isSelected ? 700 : 500, cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", fontSize: '.85rem'
                          }}>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Blankets-specific */}
            {selectedGoods.includes('blankets') && (
              <div style={{ background: '#fdf4ff', border: '1.5px solid #e0c0f0', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}>Bedding Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Type *</label>
                    <select value={goodsContactForm.blanketType || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, blanketType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select type</option>
                      <option value="blanket">Woollen Blanket</option>
                      <option value="bedsheet">Bed Sheet / Bed Cover</option>
                      <option value="pillow">Pillow / Pillowcase</option>
                      <option value="mattress">Mattress / Mattress Cover</option>
                      <option value="quilt">Quilt / Razai</option>
                      <option value="mixed-bedding">Mixed Bedding</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Size</label>
                    <select value={goodsContactForm.blanketSize || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, blanketSize: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select size</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="kids">Kids / Small</option>
                      <option value="mixed-size">Mixed Sizes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Stationery-specific */}
            {selectedGoods.includes('stationery') && (
              <div style={{ background: '#fffdf0', border: '1.5px solid #f0e0a0', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}> Stationery Details</div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.5rem', fontSize: '.85rem' }}>Items included:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {['Notebooks', 'Pens / Pencils', 'Eraser / Sharpener', 'Ruler / Scale', 'Geometry Box', 'Crayons / Sketch Pens', 'Watercolours', 'Glue / Scissors', 'Folders / Files', 'Calculator'].map(item => {
                      const statItems = goodsContactForm.statItems || [];
                      const isSelected = statItems.includes(item);
                      return (
                        <button key={item} type="button"
                          onClick={() => setGoodsContactForm(p => ({
                            ...p, statItems: isSelected ? statItems.filter(s => s !== item) : [...statItems, item]
                          }))}
                          style={{
                            padding: '.4rem .9rem', borderRadius: '20px', border: `2px solid ${isSelected ? C.primary : C.light}`,
                            background: isSelected ? '#fff3ee' : C.white, color: isSelected ? C.primary : C.mid,
                            fontWeight: isSelected ? 700 : 500, cursor: 'pointer', fontFamily: "'Crimson Pro',Georgia,serif", fontSize: '.85rem'
                          }}>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footwear-specific */}
            {selectedGoods.includes('footwear') && (
              <div style={{ background: '#fff4f0', border: '1.5px solid #f5c8b0', borderRadius: '14px', padding: '1rem 1.2rem', animation: 'fadeIn .25s ease' }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: '.7rem', fontSize: '.9rem' }}> Footwear Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Type *</label>
                    <select value={goodsContactForm.footwearType || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, footwearType: e.target.value }))}
                      style={{ ...inputBase, cursor: 'pointer', fontSize: '.9rem' }} onFocus={fi} onBlur={fo}>
                      <option value="">Select type</option>
                      <option value="shoes">Shoes / Sneakers</option>
                      <option value="sandals">Sandals / Chappals</option>
                      <option value="school-shoes">School Shoes</option>
                      <option value="boots">Boots</option>
                      <option value="mixed-footwear">Mixed Assortment</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.85rem' }}>Size Range</label>
                    <input type="text" placeholder="e.g. UK 3–6, mixed sizes…"
                      value={goodsContactForm.footwearSize || ''}
                      onChange={e => setGoodsContactForm(p => ({ ...p, footwearSize: e.target.value }))}
                      style={inputBase} onFocus={fi} onBlur={fo} />
                  </div>
                </div>
              </div>
            )}

            {/* Additional notes */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: C.dark, marginBottom: '.35rem', fontSize: '.88rem' }}>
                Additional Notes
                <span style={{ fontWeight: 400, color: C.mid, fontSize: '.8rem', marginLeft: '.4rem' }}>(optional)</span>
              </label>
              <textarea rows="2" placeholder="Any other details about your donation…"
                value={goodsContactForm.notes || ''}
                onChange={e => setGoodsContactForm(p => ({ ...p, notes: e.target.value }))}
                style={{ ...inputBase, resize: 'vertical' }} onFocus={fi} onBlur={fo} />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '.8rem' }}>
              <button onClick={() => { setShowGoodsModal(false); setGoodsErrors({}); }}
                style={{ ...btnO, borderColor: C.light, color: C.mid, padding: '.9rem 1.2rem' }}>Cancel</button>
              <button
                disabled={goodsSubmitting}
                onClick={async () => {
                 // Inline validation
                  const errs = {};
                  if (!goodsContactForm.name.trim()) errs.name = 'Full name is required.';
                  if (!goodsContactForm.email.trim()) errs.email = 'Email address is required.';
                  if (!goodsContactForm.address.trim()) errs.address = 'Pickup address is required.';
                  if (!goodsContactForm.pincode || goodsContactForm.pincode.length < 6) errs.pincode = 'Enter a valid 6-digit PIN code.';
                  if (!goodsContactForm.state) errs.state = 'Please select your state.';
                  if (!goodsContactForm.quantity.trim()) errs.quantity = 'Quantity / amount is required.';
                  if (Object.keys(errs).length > 0) { setGoodsErrors(errs); return; }
                  setGoodsErrors({});
                  setGoodsSubmitting(true);
                  const itemsList = selectedGoods.map(g => g === 'other' ? (goodsOtherText || 'Other') : g).join(', ');
                  const goodsPayload = {
                    donorName: goodsContactForm.name,
                    email: goodsContactForm.email,
                    phone: goodsContactForm.phone,
                    address: goodsContactForm.address,
                    pincode: goodsContactForm.pincode,
                    state: goodsContactForm.state,
                    quantity: goodsContactForm.quantity,
                    condition: goodsContactForm.condition,
                    foodType: goodsContactForm.foodType || '',
                    foodExpiry: goodsContactForm.foodExpiry || '',
                    foodPackaged: goodsContactForm.foodPackaged || '',
                    clothingType: goodsContactForm.clothingType || '',
                    clothingAge: goodsContactForm.clothingAge || '',
                    clothingGender: goodsContactForm.clothingGender || '',
                    clothesWashed: goodsContactForm.clothesWashed || '',
                    bookType: goodsContactForm.bookType || '',
                    bookAge: goodsContactForm.bookAge || '',
                    bookLanguage: goodsContactForm.bookLanguage || '',
                    toyType: goodsContactForm.toyType || '',
                    toyAge: goodsContactForm.toyAge || '',
                    toyParts: goodsContactForm.toyParts || '',
                    hygieneItems: (goodsContactForm.hygieneItems || []).join(', '),
                    blanketType: goodsContactForm.blanketType || '',
                    blanketSize: goodsContactForm.blanketSize || '',
                    statItems: (goodsContactForm.statItems || []).join(', '),
                    footwearType: goodsContactForm.footwearType || '',
                    footwearSize: goodsContactForm.footwearSize || '',
                    notes: goodsContactForm.notes || '',
                    items: itemsList,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                  };
                  try {
                    await apiFetch('/goods-donations', { method: 'POST', body: JSON.stringify(goodsPayload) });
                  } catch {
                    try {
                      const existing = JSON.parse(localStorage.getItem('ml_goods_donations') || '[]');
                      existing.push({ ...goodsPayload, _id: `local_${Date.now()}` });
                      localStorage.setItem('ml_goods_donations', JSON.stringify(existing));
                    } catch {}
                  }
                  setGoodsSubmitting(false);
                  setGoodsSuccess(true);
                }}
                style={{ ...btnP, flex: 1, justifyContent: 'center', background: goodsSubmitting ? '#ccc' : 'linear-gradient(135deg,#d97757,#c65d3f)', cursor: goodsSubmitting ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>
                {goodsSubmitting ? 'Sending…' : 'Confirm Donation'}
              </button>
            </div>

          </div>
        )}
      </MB>
    </ModalCard>
  </Overlay>
)}

      {/* ── 3 Tab Switcher ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem', marginBottom: '1.8rem', background: '#f4ede6', borderRadius: '18px', padding: '.4rem' }}>
        {[
          { id: 'money', label: 'Donate Money', icon: '💰' },
          { id: 'goods', label: 'Donate Goods', icon: '📦' },
          { id: 'time',  label: 'Donate Time',  icon: '🤝' },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setDonateTab(tab.id); setSelectedGoods([]); setSelectedVolAreas([]); }}
            style={{
              background: donateTab === tab.id ? C.white : 'transparent',
              border: 'none',
              borderRadius: '14px',
              padding: isMobile ? '.7rem .3rem' : '.9rem .5rem',
              cursor: 'pointer',
              fontFamily: "'Crimson Pro',Georgia,serif",
              fontWeight: donateTab === tab.id ? 800 : 600,
              color: donateTab === tab.id ? C.primary : C.mid,
              fontSize: isMobile ? '.85rem' : '1rem',
              boxShadow: donateTab === tab.id ? '0 2px 12px rgba(217,119,87,.18)' : 'none',
              transition: 'all .2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.35rem',
            }}>
            <span style={{ fontSize: isMobile ? '1.3rem' : '1.6rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════ MONEY TAB ══════════════ */}
     {donateTab === 'money' && (
  <div style={{ animation: 'fadeIn .35s ease' }}>

    {/* Impact pills */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '.6rem', marginBottom: '1.5rem' }}>
      {[
        { amt: '₹200',   label: 'Meals for a week' },
        { amt: '₹750',   label: 'School supplies' },
        { amt: '₹1,500', label: 'Medical checkup' },
        { amt: '₹5,000', label: 'Monthly support' },
      ].map((p, i) => (
        <div key={i} style={{ background: C.white, border: `2px solid ${C.light}`, borderRadius: '14px', padding: '.9rem .6rem', textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 800, color: C.primary }}>{p.amt}</div>
          <div style={{ fontSize: '.78rem', color: C.mid, marginTop: '.2rem', fontWeight: 600 }}>{p.label}</div>
        </div>
      ))}
    </div>

    <div style={{ background: C.white, padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,.1)', border: `3px solid ${C.light}` }}>
      <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', fontWeight: 700, marginBottom: '1.2rem', textAlign: 'center', color: C.dark }}>Choose Your Amount</h3>

      {/* Quick-pick buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: isMobile ? '.5rem' : '.8rem', marginBottom: '1.2rem' }}>
        {['200', '500', '750', '1000', '1500', '2000', '3000', '5000'].map(amt => {
          const isSelected = selectedDonateAmt === amt || customDonateInput === amt;
          return (
            <button key={amt}
onClick={() => {
  setSelectedDonateAmt(amt);
  setCustomDonateInput(amt); // show selected amount in the input box
}}
              style={{
                background: isSelected ? 'linear-gradient(135deg,#d97757,#c65d3f)' : 'linear-gradient(135deg,#f4e8de,#ead7c8)',
                border: `2px solid ${isSelected ? C.primary : C.light}`,
                padding: isMobile ? '.8rem .2rem' : '1rem .4rem',
                borderRadius: '14px',
                fontSize: isMobile ? '.85rem' : '1rem',
                fontWeight: 800,
                color: isSelected ? '#fff' : C.primary,
                cursor: 'pointer',
                fontFamily: "'Crimson Pro',Georgia,serif",
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'linear-gradient(135deg,#d97757,#c65d3f)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'linear-gradient(135deg,#f4e8de,#ead7c8)'; e.currentTarget.style.color = C.primary; } }}>
              ₹{parseInt(amt).toLocaleString('en-IN')}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
        <div style={{ position: 'absolute', inset: '50% 0', height: '2px', background: C.light }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <span style={{ background: C.white, padding: '0 1rem', fontSize: '.85rem', color: C.mid, fontWeight: 600 }}>or enter custom amount</span>
        </div>
      </div>

      {/* Custom amount input — fully independent */}
      <div style={{ position: 'relative', marginBottom: '1.4rem' }}>
        <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: 700, color: C.primary, pointerEvents: 'none' }}>₹</span>
        <input
          type="number" min="1"
          placeholder="Enter any amount, e.g. 1200"
          value={customDonateInput}
          onChange={e => {
            setCustomDonateInput(e.target.value);
            setSelectedDonateAmt(''); // deselect quick-pick when typing custom
          }}
          style={{ ...inputBase, paddingLeft: '3rem', fontSize: '1.1rem', fontWeight: 700 }}
          onFocus={fi} onBlur={fo}
onKeyDown={e => {
  if (e.key === 'Enter') {
    const rawAmt = customDonateInput !== '' ? customDonateInput : selectedDonateAmt;
    const amt = parseFloat(rawAmt);
    if (!rawAmt || isNaN(amt) || amt <= 0) {
      showAlert('error', 'Amount Required', 'Please select or enter a donation amount.');
      return;
    }
    if (!requireLogin(() => { setTempDonationAmount(amt); setShowDonationModal(true); })) return;
    setTempDonationAmount(amt);
    setDonorEmail(currentUser?.email || '');
    setShowDonationModal(true);
  }
}}
        />
      </div>

      <button
        onClick={() => {
          // Custom input takes priority; fall back to quick-pick
          const rawAmt = customDonateInput !== '' ? customDonateInput : selectedDonateAmt;
          const amt = parseFloat(rawAmt);
          if (!rawAmt || isNaN(amt) || amt <= 0) {
            showAlert('error', 'Amount Required', 'Please select or enter a donation amount.');
            return;
          }
          if (!requireLogin(() => { setTempDonationAmount(amt); setShowDonationModal(true); })) return;
          setTempDonationAmount(amt);
          setDonorEmail(currentUser?.email || '');
          setShowDonationModal(true);
        }}
        style={{ ...btnP, width: '100%', justifyContent: 'center', borderRadius: '16px', padding: isMobile ? '1.1rem' : '1.3rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>
        Continue to Donate
      </button>
    </div>
  </div>
)}

      {/* ══════════════ GOODS TAB ══════════════ */}
      {donateTab === 'goods' && (
        <div style={{ animation: 'fadeIn .35s ease' }}>
          <div style={{ background: '#fff8f4', border: `1.5px dashed ${C.light}`, borderRadius: '14px', padding: '.9rem 1.2rem', marginBottom: '1.4rem', fontSize: '.9rem', color: C.mid, lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: '.8rem' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>📍</span>
            <div>
              <strong style={{ color: C.dark }}>Drop-off:</strong> 123 Hope Street · Mon–Sat, 9am–5pm<br />
              <strong style={{ color: C.dark }}>Pickup:</strong> Select items below and we'll arrange a free collection from your location.
            </div>
          </div>

          <div style={{ background: C.white, padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,.1)', border: `3px solid ${C.light}` }}>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.7rem', fontWeight: 700, marginBottom: '.4rem', color: C.dark }}>What would you like to donate?</h3>
            <p style={{ fontSize: '.9rem', color: C.mid, margin: '0 0 1.4rem' }}>Select one or more — we accept all gently used or new items.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '.9rem', marginBottom: '1.4rem' }}>
              {[
                { id: 'food',    icon: '🥫', label: 'Food',         desc: 'Non-perishable, dry goods' },
                { id: 'clothes', icon: '👕', label: 'Clothes',      desc: 'Any age, clean condition' },
                { id: 'books',   icon: '📚', label: 'Books',        desc: 'Educational & storybooks' },
                { id: 'toys',    icon: '🧸', label: 'Toys & Games', desc: 'Safe, clean condition' },
                { id: 'hygiene', icon: '🧴', label: 'Hygiene Kits', desc: 'Soap, toothbrush, etc.' },
                { id: 'blankets',icon: '🛏️', label: 'Blankets',     desc: 'Bedding & warm items' },
                { id: 'stationery', icon: '✏️', label: 'Stationery', desc: 'Pens, notebooks, art supplies' },
                { id: 'footwear', icon: '👟', label: 'Footwear',    desc: 'Shoes, sandals, any size' },
                { id: 'other',   icon: '➕', label: 'Something else', desc: 'Tell us what you have' },
              ].map(item => {
                const isSelected = selectedGoods.includes(item.id);
                return (
                  <div key={item.id}
                    onClick={() => setSelectedGoods(prev => isSelected ? prev.filter(g => g !== item.id) : [...prev, item.id])}
                    style={{
                      border: `2px solid ${isSelected ? C.primary : C.light}`,
                      borderRadius: '16px',
                      background: isSelected ? '#fff3ee' : C.white,
                      padding: isMobile ? '1rem .8rem' : '1.2rem 1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all .18s',
                      position: 'relative',
                    }}>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '.4rem', right: '.5rem', width: '18px', height: '18px', borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.65rem', fontWeight: 800 }}>✓</div>
                    )}
                    <div style={{ fontSize: isMobile ? '1.6rem' : '2rem', marginBottom: '.4rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: 800, color: isSelected ? C.primary : C.dark, fontSize: isMobile ? '.88rem' : '.95rem', marginBottom: '.2rem' }}>{item.label}</div>
                    {!isMobile && <div style={{ fontSize: '.78rem', color: C.mid }}>{item.desc}</div>}
                  </div>
                );
              })}
            </div>

            {/* Other text input */}
            {selectedGoods.includes('other') && (
              <div style={{ marginBottom: '1.2rem', animation: 'fadeIn .25s ease' }}>
                <input type="text" placeholder="Describe what you'd like to donate…"
                  value={goodsOtherText} onChange={e => setGoodsOtherText(e.target.value)}
                  style={inputBase} onFocus={fi} onBlur={fo} />
              </div>
            )}

            <button
            onClick={() => {
  if (selectedGoods.length === 0) {
    showAlert('error', 'Nothing selected', 'Please select at least one item to donate.');
    return;
  }
  setGoodsSuccess(false);
  setGoodsContactForm({
    name: '', email: '', phone: '', address: '', pincode: '', state: '',
    quantity: '', foodType: '', foodExpiry: '', foodPackaged: '',
    clothingType: '', clothingAge: '', clothingGender: '', clothesWashed: '',
    bookType: '', bookAge: '', bookLanguage: '', bookCondition: '',
    toyType: '', toyAge: '', toyParts: '',
    hygieneItems: [], statItems: [],
    blanketType: '', blanketSize: '',
    footwearType: '', footwearSize: '',
    notes: '', condition: 'new',
  });
  setShowGoodsModal(true);  
}}
              style={{ ...btnP, width: '100%', justifyContent: 'center', borderRadius: '16px', padding: isMobile ? '1.1rem' : '1.3rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>
              {selectedGoods.length > 0 ? `Schedule Donation (${selectedGoods.length} item${selectedGoods.length > 1 ? 's' : ''})` : 'Schedule Donation'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ TIME TAB ══════════════ */}
      {donateTab === 'time' && (
        <div style={{ animation: 'fadeIn .35s ease' }}>
          <div style={{ background: 'linear-gradient(135deg,#f4e8de,#ead7c8)', border: `2px solid ${C.light}`, borderRadius: '14px', padding: '1rem 1.4rem', marginBottom: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '.8rem' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🤝</span>
            <div style={{ fontSize: '.92rem', color: C.mid, lineHeight: 1.7 }}>
              <strong style={{ color: C.dark }}>Volunteers are the heart of MakeLife.</strong><br />
              Pick one or more areas where you can help. We'll match you with children who need your skills most.
            </div>
          </div>

          <div style={{ background: C.white, padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,.1)', border: `3px solid ${C.light}` }}>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.7rem', fontWeight: 700, marginBottom: '.4rem', color: C.dark }}>Where can you help?</h3>
            <p style={{ fontSize: '.9rem', color: C.mid, margin: '0 0 1.4rem' }}>Select all areas that match your skills or interests.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '.9rem', marginBottom: '1.4rem' }}>
              {[
                { id: 'teaching',   icon: '📖', label: 'Teaching',      desc: 'Tutor children 1-on-1' },
                { id: 'medical',    icon: '🩺', label: 'Medical',       desc: 'Checkups & healthcare' },
                { id: 'arts',       icon: '🎨', label: 'Arts & Crafts', desc: 'Creative workshops' },
                { id: 'sports',     icon: '⚽', label: 'Sports',        desc: 'Outdoor activities' },
                { id: 'counseling', icon: '💬', label: 'Counseling',    desc: 'Emotional support' },
                { id: 'it',         icon: '💻', label: 'IT & Tech',     desc: 'Computer skills' },
                { id: 'cooking',    icon: '🍳', label: 'Cooking',       desc: 'Nutrition & meals' },
                { id: 'fundraising',icon: '📢', label: 'Fundraising',   desc: 'Events & outreach' },
                { id: 'other-v',    icon: '✨', label: 'Other skills',  desc: 'Tell us your talent' },
              ].map(item => {
                const isSelected = selectedVolAreas.includes(item.id);
                return (
                  <div key={item.id}
                    onClick={() => setSelectedVolAreas(prev => isSelected ? prev.filter(a => a !== item.id) : [...prev, item.id])}
                    style={{
                      border: `2px solid ${isSelected ? C.primary : C.light}`,
                      borderRadius: '16px',
                      background: isSelected ? '#fff3ee' : C.white,
                      padding: isMobile ? '1rem .8rem' : '1.2rem 1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all .18s',
                      position: 'relative',
                    }}>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '.4rem', right: '.5rem', width: '18px', height: '18px', borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.65rem', fontWeight: 800 }}>✓</div>
                    )}
                    <div style={{ fontSize: isMobile ? '1.6rem' : '2rem', marginBottom: '.4rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: 800, color: isSelected ? C.primary : C.dark, fontSize: isMobile ? '.88rem' : '.95rem', marginBottom: '.2rem' }}>{item.label}</div>
                    {!isMobile && <div style={{ fontSize: '.78rem', color: C.mid }}>{item.desc}</div>}
                  </div>
                );
              })}
            </div>

            {/* Other volunteer text */}
            {selectedVolAreas.includes('other-v') && (
              <div style={{ marginBottom: '1.2rem', animation: 'fadeIn .25s ease' }}>
                <input type="text" placeholder="Describe your skill or talent…"
                  value={volOtherText} onChange={e => setVolOtherText(e.target.value)}
                  style={inputBase} onFocus={fi} onBlur={fo} />
              </div>
            )}

            <button
              onClick={() => {
                if (selectedVolAreas.length === 0) {
                  showAlert('error', 'Nothing selected', 'Please select at least one area you can help with.');
                  return;
                }
                // Pre-fill volunteer form areas and navigate
                const mappedAreas = selectedVolAreas.map(a =>
                  a === 'teaching' ? 'Teaching & Tutoring' :
                  a === 'medical' ? 'Medical & Healthcare' :
                  a === 'arts' ? 'Arts & Crafts' :
                  a === 'sports' ? 'Sports & Recreation' :
                  a === 'counseling' ? 'Counseling' :
                  a === 'it' ? 'IT & Technology' :
                  a === 'cooking' ? 'Food & Nutrition' :
                  a === 'fundraising' ? 'Fundraising' :
                  volOtherText || 'Other'
                );
                setVolunteerForm(prev => ({ ...prev, areas: mappedAreas }));
                go('volunteer');
              }}
              style={{ ...btnP, width: '100%', justifyContent: 'center', borderRadius: '16px', padding: isMobile ? '1.1rem' : '1.3rem', fontSize: isMobile ? '1rem' : '1.1rem', background: 'linear-gradient(135deg,#2a7d4f,#48bb78)' }}>
              {selectedVolAreas.length > 0 ? `Apply to Volunteer (${selectedVolAreas.length} area${selectedVolAreas.length > 1 ? 's' : ''})` : 'Apply to Volunteer'}
            </button>
          </div>
        </div>
      )}

    </section>
  </div>
)}

      {/* CONTACT */}
      {activeSection==='contact' && (
        <div style={{animation:'fadeIn .6s ease-in'}}>
          <section style={{maxWidth:'1100px',margin:'0 auto',padding:sP}}>
            <h2 style={{fontSize:isMobile?'1.9rem':'3rem',fontWeight:700,textAlign:'center',marginBottom:'.6rem',color:C.dark}}>Get in Touch</h2>
            <p style={{fontSize:'1.1rem',textAlign:'center',color:C.mid,marginBottom:'2.5rem'}}>Have questions? We'd love to hear from you.</p>
            <div style={{display:'grid',gridTemplateColumns:isTablet?'1fr':'1fr 1fr',gap:'2rem'}}>
              <div style={{background:C.white,padding:isMobile?'1.5rem':'2.5rem',borderRadius:'24px',boxShadow:'0 12px 40px rgba(0,0,0,.09)',border:`3px solid ${C.light}`}}>
                <h3 style={{fontSize:isMobile?'1.3rem':'1.7rem',fontWeight:700,marginBottom:'1.5rem',color:C.dark}}>Send Us a Message</h3>
                {contactSuccess && <div style={{background:'#d4edda',color:'#155724',border:'2px solid #c3e6cb',borderRadius:'12px',padding:'1rem 1.2rem',marginBottom:'1.2rem',fontSize:'.95rem',fontWeight:600}}> Message sent! We'll get back to you soon.</div>}
                {contactError && <div style={{background:'#fff0f0',border:'2px solid #f5c6cb',borderRadius:'12px',padding:'.9rem 1.1rem',marginBottom:'1.2rem',color:'#c0392b',fontWeight:700}}>{contactError==='NETWORK_ERROR'?'Backend not running — please start your server':contactError}</div>}
                <form onSubmit={handleContactSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {[['name','text','Your Name',true],['email','email','Your Email',true],['phone','tel','Phone (Optional)',false]].map(([name,type,ph,req])=>(<input key={name} type={type} name={name} placeholder={ph} required={req} value={contactForm[name]} onChange={handleContactChange} style={inputBase} onFocus={fi} onBlur={fo}/>))}
                  <textarea name="message" placeholder="Your Message" required rows="4" value={contactForm.message} onChange={handleContactChange} style={{...inputBase,resize:'vertical'}} onFocus={fi} onBlur={fo}/>
                  <button type="submit" disabled={contactSubmitting} style={{...btnP,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1.1rem',background:contactSubmitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:contactSubmitting?'not-allowed':'pointer',boxShadow:'none'}}>{contactSubmitting?'Sending…':'Send Message'}</button>
                </form>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                <div style={{background:C.white,padding:isMobile?'1.5rem':'2rem',borderRadius:'22px',boxShadow:'0 8px 30px rgba(0,0,0,.08)',border:`2px solid ${C.light}`}}>
                  <h3 style={{fontSize:isMobile?'1.25rem':'1.6rem',fontWeight:700,marginBottom:'1.2rem',color:C.dark}}>Contact Information</h3>
                  {[{icon:<MapPin size={22}/>,label:'Address',val:'123 Hope Street, Compassion City'},{icon:<Phone size={22}/>,label:'Phone',val:'+1 (555) 123-4567'},{icon:<Mail size={22}/>,label:'Email',val:'info@makelife.org'}].map((item,i)=>(<div key={i} style={{display:'flex',alignItems:'flex-start',gap:'.8rem',marginBottom:i<2?'1.1rem':0}}><div style={{color:C.primary,flexShrink:0,marginTop:'.15rem'}}>{item.icon}</div><div><div style={{fontWeight:700,fontSize:'1rem',color:C.dark,marginBottom:'.2rem'}}>{item.label}</div><div style={{fontSize:'.95rem',color:C.mid}}>{item.val}</div></div></div>))}
                </div>
                <div style={{background:'linear-gradient(135deg,#f4e8de,#ead7c8)',padding:isMobile?'1.5rem':'2rem',borderRadius:'22px',border:`2px solid ${C.light}`}}>
                  <h3 style={{fontSize:isMobile?'1.25rem':'1.6rem',fontWeight:700,marginBottom:'.8rem',color:C.dark}}>Visit Us</h3>
                  <div style={{fontSize:'.95rem',color:C.mid,fontWeight:600,lineHeight:2}}><div>Mon – Fri: 9:00 AM – 5:00 PM</div><div>Saturday: 10:00 AM – 3:00 PM</div><div>Sunday: Closed</div></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VOLUNTEER */}
      {activeSection==='volunteer' && (
        <div style={{animation:'fadeIn .6s ease-in'}}>
          <section style={{maxWidth:'860px',margin:'0 auto',padding:sP}}>
            <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
              <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'64px',height:'64px',borderRadius:'50%',background:'linear-gradient(135deg,#d97757,#c65d3f)',marginBottom:'1rem'}}><Heart size={30} color="#fff" fill="#fff"/></div>
              <h2 style={{fontSize:isMobile?'1.9rem':'3rem',fontWeight:700,color:C.dark,margin:'0 0 .6rem'}}>Become a Volunteer</h2>
              <p style={{fontSize:'1.1rem',color:C.mid,maxWidth:'600px',margin:'0 auto'}}>Join our family of dedicated volunteers and make a real difference in the lives of children who need you most.</p>
            </div>
            {volunteerSuccess ? (
              <div style={{background:'linear-gradient(135deg,#d4edda,#c3e6cb)',border:'2px solid #a3d9a5',borderRadius:'24px',padding:'3rem 2rem',textAlign:'center'}}>
                <div style={{fontSize:'3.5rem',marginBottom:'1rem'}}></div>
                <h3 style={{fontSize:'1.8rem',fontWeight:700,color:'#155724',margin:'0 0 .8rem'}}>Application Received!</h3>
                <p style={{fontSize:'1.05rem',color:'#1e7e34',margin:'0 0 1.5rem'}}>Thank you for your willingness to serve. We'll contact you within 3-5 business days.</p>
                <button onClick={()=>{setVolunteerSuccess(false);setVolunteerForm({fullName:'',email:'',phone:'',age:'',occupation:'',availability:'weekends',areas:[],experience:'',motivation:''});}} style={{...btnP,margin:'0 auto'}}>Submit Another Application</button>
              </div>
            ) : (
              <div style={{background:C.white,borderRadius:'24px',boxShadow:'0 12px 40px rgba(0,0,0,.09)',border:`3px solid ${C.light}`,padding:isMobile?'1.5rem':'2.5rem'}}>
                {volunteerError && <div style={{background:'#fff0f0',border:'2px solid #f5c6cb',borderRadius:'12px',padding:'.9rem 1.1rem',marginBottom:'1.2rem',color:'#c0392b',fontWeight:600}}>{volunteerError}</div>}
                <div style={{display:'grid',gridTemplateColumns:isTablet?'1fr':'1fr 1fr',gap:'1.2rem',marginBottom:'1.2rem'}}>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Full Name *</label><input type="text" placeholder="Your full name" value={volunteerForm.fullName} onChange={e=>setVolunteerForm(p=>({...p,fullName:e.target.value}))} style={inputBase} onFocus={fi} onBlur={fo}/></div>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Email Address *</label><input type="email" placeholder="your@email.com" value={volunteerForm.email} onChange={e=>setVolunteerForm(p=>({...p,email:e.target.value}))} style={inputBase} onFocus={fi} onBlur={fo}/></div>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Phone Number</label><input type="tel" maxLength="10" placeholder="10-digit mobile number" value={volunteerForm.phone} onChange={e=>setVolunteerForm(p=>({...p,phone:e.target.value.replace(/\\D/g, '').slice(0, 10)}))} style={inputBase} onFocus={fi} onBlur={fo}/></div>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Age</label><input type="number" placeholder="Your age" min="16" max="80" value={volunteerForm.age} onChange={e=>setVolunteerForm(p=>({...p,age:e.target.value}))} style={inputBase} onFocus={fi} onBlur={fo}/></div>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Occupation</label><input type="text" placeholder="e.g. Teacher, Doctor" value={volunteerForm.occupation} onChange={e=>setVolunteerForm(p=>({...p,occupation:e.target.value}))} style={inputBase} onFocus={fi} onBlur={fo}/></div>
                  <div><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Availability *</label>
                    <select value={volunteerForm.availability} onChange={e=>setVolunteerForm(p=>({...p,availability:e.target.value}))} style={{...inputBase,cursor:'pointer'}}>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="both">Both</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:'1.2rem'}}><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.6rem',fontSize:'.95rem'}}>Areas of Interest</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
                    {['Teaching & Tutoring','Medical & Healthcare','Arts & Crafts','Sports & Recreation','Counseling','Fundraising','Food & Nutrition','IT & Technology'].map(area=>{
                      const active=volunteerForm.areas.includes(area);
                      return <button key={area} type="button" onClick={()=>setVolunteerForm(p=>({...p,areas:active?p.areas.filter(a=>a!==area):[...p.areas,area]}))} style={{padding:'.45rem 1rem',borderRadius:'20px',border:`2px solid ${active?C.primary:C.light}`,background:active?'#fff3ee':'#fafafa',color:active?C.primary:C.mid,fontSize:'.88rem',fontWeight:active?700:500,cursor:'pointer',fontFamily:"'Crimson Pro',Georgia,serif"}}>{area}</button>;
                    })}
                  </div>
                </div>
                <div style={{marginBottom:'1.2rem'}}><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Previous Experience</label><textarea placeholder="Briefly describe any relevant experience..." rows="3" value={volunteerForm.experience} onChange={e=>setVolunteerForm(p=>({...p,experience:e.target.value}))} style={{...inputBase,resize:'vertical'}} onFocus={fi} onBlur={fo}/></div>
                <div style={{marginBottom:'1.5rem'}}><label style={{display:'block',fontWeight:700,color:C.dark,marginBottom:'.4rem',fontSize:'.95rem'}}>Why volunteer with us? *</label><textarea placeholder="Tell us what motivates you..." rows="4" value={volunteerForm.motivation} onChange={e=>setVolunteerForm(p=>({...p,motivation:e.target.value}))} style={{...inputBase,resize:'vertical'}} onFocus={fi} onBlur={fo}/></div>
                <button onClick={async()=>{
                  if(!volunteerForm.fullName.trim()||!volunteerForm.email.trim()||!volunteerForm.motivation.trim()){setVolunteerError('Please fill in all required fields.');return;}
                  if(!/\S+@\S+\.\S+/.test(volunteerForm.email)){setVolunteerError('Please enter a valid email address.');return;}
                  setVolunteerSubmitting(true);setVolunteerError('');
                  try{
                    await apiFetch('${process.env.REACT_APP_API_URL}/volunteers',{method:'POST',body:JSON.stringify(volunteerForm)});
                    // Also save to time-donations
                 setVolunteerSuccess(true);
                    setVolunteerSuccess(true);
                  }catch(err){
                    if(err.message.includes('fetch')||err.message.includes('route not found')){setVolunteerSuccess(true);}
                    else{setVolunteerError(err.message||'Failed to submit.');}
                  }finally{setVolunteerSubmitting(false);}
                }} disabled={volunteerSubmitting} style={{...btnP,width:'100%',justifyContent:'center',borderRadius:'14px',padding:'1.1rem',background:volunteerSubmitting?'#ccc':'linear-gradient(135deg,#d97757,#c65d3f)',cursor:volunteerSubmitting?'not-allowed':'pointer',boxShadow:'none',fontSize:'1.05rem'}}>
                  {volunteerSubmitting?'Submitting…':'Submit Volunteer Application'}
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{background:'linear-gradient(135deg,#2c1810,#4a3428)',color:'#fff',padding:isMobile?'2.5rem 1.2rem 1.5rem':'3.5rem 2rem 2rem',marginTop:'4rem'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'1fr':isTablet?'1fr 1fr':'repeat(3,1fr)',gap:isMobile?'2rem':'2.5rem',marginBottom:'2rem'}}>
          <div><div style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'1rem'}}><Heart size={26} fill="white"/><h3 style={{fontSize:'1.4rem',fontWeight:700,margin:0}}>MakeLife</h3></div><p style={{fontSize:'.9rem',lineHeight:1.7,color:'#e8d5c4',margin:0}}>Transforming lives and building brighter futures for children in need.</p></div>
          <div><h4 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'1rem'}}>Quick Links</h4><div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>{NAVLINKS.map(l=><button key={l} onClick={()=>go(l.toLowerCase())} style={{background:'none',border:'none',color:'#e8d5c4',fontSize:'.9rem',cursor:'pointer',textAlign:'left',padding:'.2rem 0',fontFamily:"'Crimson Pro',Georgia,serif"}}>{l}</button>)}</div></div>
          <div><h4 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'1rem'}}>Connect</h4><div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}><div style={{display:'flex',alignItems:'center',gap:'.7rem'}}><Mail size={17}/><span style={{fontSize:'.9rem',color:'#e8d5c4'}}>info@makelife.org</span></div><div style={{display:'flex',alignItems:'center',gap:'.7rem'}}><Phone size={17}/><span style={{fontSize:'.9rem',color:'#e8d5c4'}}>+1 (555) 123-4567</span></div></div></div>
        </div>
        <div style={{maxWidth:'1400px',margin:'0 auto',paddingTop:'1.5rem',borderTop:'1px solid rgba(232,213,196,.3)',textAlign:'center',fontSize:'.85rem',color:'#e8d5c4'}}>© 2026 MakeLife Orphanage. All rights reserved.</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;}
        body{margin:0;padding:0;-webkit-font-smoothing:antialiased;}
        input,textarea,select{font-size:16px!important;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
        *{-webkit-tap-highlight-color:transparent;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes authPopIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes floatHeart{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-18px) rotate(8deg)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        button{min-height:44px;touch-action:manipulation;}
      `}</style>
    </div>
  );
};

export default AppRoot;