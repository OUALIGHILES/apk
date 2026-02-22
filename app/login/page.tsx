'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Phone, Lock, Eye, EyeOff, Fingerprint, Coffee } from 'lucide-react';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

interface LoginForm { mobile: string; password: string; }

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true); setError('');
      const response = await authAPI.login(data.mobile, data.password, 'USER');
      if (response.status === 'success' && response.result) {
        setUser(response.result); setToken(response.result.token);
        localStorage.setItem('user_id', response.result.id);
        router.push('/');
      } else setError(response.message || 'Login failed');
    } catch (err: any) { setError(err.response?.data?.message || 'Invalid mobile number or password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <style>{css}</style>
      <div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" />
      <div className="auth-scroll">
        <div className="auth-logo-wrap">
          <Link href="/" className="auth-logo">
            <div className="logo-box"><Coffee className="w-6 h-6 logo-icon" /></div>
            <span className="logo-text">Kafek</span>
          </Link>
        </div>
        <div className="auth-headline">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to continue your journey</p>
        </div>
        <div className="auth-card">
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="field-group">
              <label className="field-label">Mobile Number</label>
              <div className="field-wrap">
                <Phone className="field-icon" />
                <input type="tel" placeholder="Enter your mobile number" className={`field-input ${errors.mobile ? 'field-error-border' : ''}`}
                  {...register('mobile', { required: 'Required', pattern: { value: /^[0-9]{10,15}$/i, message: 'Invalid number' } })} />
              </div>
              {errors.mobile && <p className="field-err-msg">{errors.mobile.message}</p>}
            </div>
            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label">Password</label>
                <Link href="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <div className="field-wrap">
                <Lock className="field-icon" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className={`field-input field-input-pr ${errors.password ? 'field-error-border' : ''}`}
                  {...register('password', { required: 'Required' })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="field-err-msg">{errors.password.message}</p>}
            </div>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <><span className="btn-spinner" />Signing in...</> : 'Sign In'}
            </button>
          </form>
          <div className="divider"><span>or continue with</span></div>
          <div className="social-row">
            <button className="social-btn">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="social-btn">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
          <button className="biometric-btn"><Fingerprint className="w-5 h-5" />Use Biometric Login</button>
          <p className="auth-switch">Don't have an account? <Link href="/signup" className="auth-switch-link">Sign Up</Link></p>
        </div>
        <p className="auth-terms">By signing in you agree to our <Link href="/terms" className="terms-link">Terms</Link> and <Link href="/privacy" className="terms-link">Privacy Policy</Link></p>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
  :root{--primary:#0A1628;--accent:#3D6FFF;--accent2:#FF5C3A;--green:#1DB87A;--muted:#8B8FA8;--border:#ECEDF2;--bg:#F7F6F2;font-family:'DM Sans',sans-serif}
  .auth-root{min-height:100vh;background:var(--primary);position:relative;overflow:hidden;display:flex;flex-direction:column}
  .bg-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.12;pointer-events:none}
  .bg-blob-1{width:400px;height:400px;background:#3D6FFF;top:-100px;right:-100px}
  .bg-blob-2{width:350px;height:350px;background:#FF5C3A;bottom:-80px;left:-80px}
  .auth-scroll{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;padding:52px 20px 40px;min-height:100vh}
  .auth-logo-wrap{align-self:flex-start;margin-bottom:36px}
  .auth-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
  .logo-box{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center}
  .logo-icon{color:var(--accent)}
  .logo-text{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff}
  .auth-headline{align-self:flex-start;margin-bottom:28px}
  .auth-title{font-family:'Sora',sans-serif;font-size:32px;font-weight:800;color:#fff;margin-bottom:6px}
  .auth-sub{font-size:15px;color:rgba(255,255,255,.5)}
  .auth-card{width:100%;max-width:420px;background:#fff;border-radius:28px;padding:28px 24px;box-shadow:0 32px 80px rgba(0,0,0,.45)}
  .auth-form{display:flex;flex-direction:column;gap:18px}
  .field-group{display:flex;flex-direction:column;gap:6px}
  .field-label{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .field-label-row{display:flex;justify-content:space-between;align-items:center}
  .forgot-link{font-size:12px;font-weight:600;color:var(--accent);text-decoration:none}
  .field-wrap{position:relative}
  .field-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:17px;height:17px;color:var(--muted)}
  .field-input{width:100%;padding:13px 14px 13px 42px;border:1.5px solid var(--border);border-radius:14px;background:var(--bg);font-size:14px;color:var(--primary);outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s}
  .field-input-pr{padding-right:44px}
  .field-input:focus{border-color:var(--accent);background:#fff}
  .field-input::placeholder{color:var(--muted)}
  .field-error-border{border-color:var(--accent2)!important}
  .field-err-msg{font-size:11px;color:var(--accent2);font-weight:500}
  .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--muted);transition:color .15s;cursor:pointer}
  .eye-btn:hover{color:var(--primary)}
  .auth-error{padding:12px 16px;background:rgba(255,92,58,.08);border:1px solid rgba(255,92,58,.2);border-radius:14px;font-size:13px;color:var(--accent2)}
  .submit-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:15px;background:var(--primary);color:#fff;border-radius:16px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;box-shadow:0 8px 28px rgba(10,22,40,.3);transition:all .2s;cursor:pointer;margin-top:4px;width:100%}
  .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px rgba(10,22,40,.45)}
  .submit-btn:active{transform:scale(.97)}
  .submit-btn:disabled{opacity:.55}
  .btn-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
  @keyframes spin{to{transform:rotate(360deg)}}
  .divider{display:flex;align-items:center;gap:12px;margin:22px 0 16px;color:var(--muted);font-size:12px}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
  .social-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .social-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border:1.5px solid var(--border);border-radius:14px;font-size:13px;font-weight:600;color:var(--primary);background:var(--bg);transition:all .15s;cursor:pointer;font-family:'Sora',sans-serif}
  .social-btn:hover{border-color:var(--accent);background:rgba(61,111,255,.04)}
  .biometric-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;color:var(--muted);font-size:13px;font-weight:600;font-family:'Sora',sans-serif;border-radius:14px;transition:background .15s,color .15s;cursor:pointer;margin-bottom:16px}
  .biometric-btn:hover{background:rgba(10,22,40,.04);color:var(--primary)}
  .auth-switch{text-align:center;font-size:13px;color:var(--muted)}
  .auth-switch-link{color:var(--primary);font-weight:700;text-decoration:none}
  .auth-switch-link:hover{text-decoration:underline}
  .auth-terms{margin-top:24px;text-align:center;font-size:11px;color:rgba(255,255,255,.3);max-width:320px}
  .terms-link{color:rgba(255,255,255,.5);text-decoration:underline}
`;