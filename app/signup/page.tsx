'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Eye, EyeOff, Coffee, Check } from 'lucide-react';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

interface SignupForm {
  first_name: string; last_name: string; email: string;
  mobile: string; password: string; confirm_password: string;
  gender: 'Male' | 'Female';
}

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>();
  const password = watch('password');

  const onSubmit = async (data: SignupForm) => {
    try {
      setLoading(true); setError('');
      const response = await authAPI.signup({ first_name: data.first_name, last_name: data.last_name, email: data.email, mobile: data.mobile, mobile_with_code: data.mobile, password: data.password, gender: data.gender, type: 'USER' });
      if (response.status === 'success' && response.result) {
        setUser(response.result); setToken(response.result.token);
        localStorage.setItem('user_id', response.result.id);
        router.push('/');
      } else setError(response.message || 'Signup failed');
    } catch (err: any) { setError(err.response?.data?.message || 'Signup failed. Please try again.'); }
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join Kafek and start your journey</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Name row */}
            <div className="name-row">
              <div className="field-group">
                <label className="field-label">First Name</label>
                <div className="field-wrap">
                  <User className="field-icon" />
                  <input type="text" placeholder="First" className={`field-input ${errors.first_name ? 'field-error-border' : ''}`}
                    {...register('first_name', { required: 'Required' })} />
                </div>
                {errors.first_name && <p className="field-err-msg">{errors.first_name.message}</p>}
              </div>
              <div className="field-group">
                <label className="field-label">Last Name</label>
                <div className="field-wrap">
                  <input type="text" placeholder="Last" className={`field-input field-input-npl ${errors.last_name ? 'field-error-border' : ''}`}
                    {...register('last_name', { required: 'Required' })} />
                </div>
                {errors.last_name && <p className="field-err-msg">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <Mail className="field-icon" />
                <input type="email" placeholder="Enter your email" className={`field-input ${errors.email ? 'field-error-border' : ''}`}
                  {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })} />
              </div>
              {errors.email && <p className="field-err-msg">{errors.email.message}</p>}
            </div>

            {/* Mobile */}
            <div className="field-group">
              <label className="field-label">Mobile Number</label>
              <div className="field-wrap">
                <Phone className="field-icon" />
                <input type="tel" placeholder="Enter your mobile number" className={`field-input ${errors.mobile ? 'field-error-border' : ''}`}
                  {...register('mobile', { required: 'Required' })} />
              </div>
              {errors.mobile && <p className="field-err-msg">{errors.mobile.message}</p>}
            </div>

            {/* Gender */}
            <div className="field-group">
              <label className="field-label">Gender</label>
              <select className={`field-input field-select ${errors.gender ? 'field-error-border' : ''}`}
                {...register('gender', { required: 'Required' })}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="field-err-msg">{errors.gender.message}</p>}
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <Lock className="field-icon" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className={`field-input field-input-pr ${errors.password ? 'field-error-border' : ''}`}
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="field-err-msg">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="field-group">
              <label className="field-label">Confirm Password</label>
              <div className="field-wrap">
                <Lock className="field-icon" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" className={`field-input field-input-pr ${errors.confirm_password ? 'field-error-border' : ''}`}
                  {...register('confirm_password', { required: 'Required', validate: v => v === password || 'Passwords do not match' })} />
              </div>
              {errors.confirm_password && <p className="field-err-msg">{errors.confirm_password.message}</p>}
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <><span className="btn-spinner" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          {/* Benefits */}
          <div className="benefits">
            {['Order from your favorite stores', 'Track your orders in real-time', 'Exclusive offers and discounts'].map((b) => (
              <div key={b} className="benefit-row">
                <span className="benefit-check"><Check className="w-3 h-3" /></span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="divider"><span>Already have an account?</span></div>
          <Link href="/login" className="sign-in-btn">Sign In</Link>
        </div>

        <p className="auth-terms">By creating an account you agree to our <Link href="/terms" className="terms-link">Terms</Link> and <Link href="/privacy" className="terms-link">Privacy Policy</Link></p>
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
  .auth-logo-wrap{align-self:flex-start;margin-bottom:32px}
  .auth-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
  .logo-box{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center}
  .logo-icon{color:var(--accent)}
  .logo-text{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff}
  .auth-headline{align-self:flex-start;margin-bottom:24px}
  .auth-title{font-family:'Sora',sans-serif;font-size:32px;font-weight:800;color:#fff;margin-bottom:6px}
  .auth-sub{font-size:15px;color:rgba(255,255,255,.5)}
  .auth-card{width:100%;max-width:420px;background:#fff;border-radius:28px;padding:28px 24px;box-shadow:0 32px 80px rgba(0,0,0,.45)}
  .auth-form{display:flex;flex-direction:column;gap:16px}
  .name-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .field-group{display:flex;flex-direction:column;gap:5px}
  .field-label{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .field-wrap{position:relative}
  .field-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--muted)}
  .field-input{width:100%;padding:12px 14px 12px 40px;border:1.5px solid var(--border);border-radius:13px;background:var(--bg);font-size:13px;color:var(--primary);outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s}
  .field-input-npl{padding-left:14px}
  .field-input-pr{padding-right:42px}
  .field-select{padding-left:14px;cursor:pointer;appearance:none}
  .field-input:focus{border-color:var(--accent);background:#fff}
  .field-input::placeholder{color:var(--muted)}
  .field-error-border{border-color:var(--accent2)!important}
  .field-err-msg{font-size:11px;color:var(--accent2);font-weight:500}
  .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--muted);transition:color .15s;cursor:pointer}
  .eye-btn:hover{color:var(--primary)}
  .auth-error{padding:12px 16px;background:rgba(255,92,58,.08);border:1px solid rgba(255,92,58,.2);border-radius:13px;font-size:13px;color:var(--accent2)}
  .submit-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:15px;background:var(--primary);color:#fff;border-radius:16px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;box-shadow:0 8px 28px rgba(10,22,40,.3);transition:all .2s;cursor:pointer;margin-top:4px;width:100%}
  .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px rgba(10,22,40,.45)}
  .submit-btn:active{transform:scale(.97)}
  .submit-btn:disabled{opacity:.55}
  .btn-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
  @keyframes spin{to{transform:rotate(360deg)}}
  .benefits{display:flex;flex-direction:column;gap:8px;margin-top:20px;padding-top:20px;border-top:1px solid var(--border)}
  .benefit-row{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted)}
  .benefit-check{width:20px;height:20px;border-radius:6px;background:rgba(29,184,122,.12);color:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .divider{display:flex;align-items:center;gap:12px;margin:20px 0 14px;color:var(--muted);font-size:12px}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
  .sign-in-btn{display:block;text-align:center;padding:13px;border:1.5px solid var(--border);border-radius:16px;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--primary);text-decoration:none;transition:all .15s;background:var(--bg)}
  .sign-in-btn:hover{border-color:var(--accent);background:rgba(61,111,255,.04);color:var(--accent)}
  .auth-terms{margin-top:24px;text-align:center;font-size:11px;color:rgba(255,255,255,.3);max-width:320px}
  .terms-link{color:rgba(255,255,255,.5);text-decoration:underline}
`;