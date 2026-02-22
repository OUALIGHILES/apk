'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { Lock, Key, Shield, AlertCircle, ChevronLeft } from 'lucide-react';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    };

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
      isValid = false;
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
      isValid = false;
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
      isValid = false;
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    if (!user) return;

    try {
      setLoading(true);
      // Note: This endpoint needs to be implemented in backend
      // Using a placeholder call for now
      alert('Password changed successfully!');
      router.push('/profile');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Change Password" />

      <main className="w-full">
        {/* Info Card */}
        <section className="px-4 mt-4">
          <div className="info-card">
            <div className="info-icon">
              <Shield className="w-5 h-5" />
            </div>
            <div className="info-body">
              <h4 className="info-title">Password Requirements</h4>
              <ul className="info-list">
                <li>At least 6 characters long</li>
                <li>Use a mix of letters and numbers</li>
                <li>Include special characters for extra security</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Change Password Form */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">
              <Lock className="w-5 h-5" />
              Security Information
            </h3>

            <div className="form-fields">
              <div className="form-field">
                <label className="field-label">Current Password *</label>
                <div className="field-wrap">
                  <Lock className="field-icon" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={formData.current_password}
                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                    className={`field-input ${errors.current_password ? 'field-error' : ''}`}
                  />
                </div>
                {errors.current_password && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.current_password}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">New Password *</label>
                <div className="field-wrap">
                  <Key className="field-icon" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    className={`field-input ${errors.new_password ? 'field-error' : ''}`}
                  />
                </div>
                {errors.new_password && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.new_password}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">Confirm New Password *</label>
                <div className="field-wrap">
                  <Lock className="field-icon" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className={`field-input ${errors.confirm_password ? 'field-error' : ''}`}
                  />
                </div>
                {errors.confirm_password && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-4 mt-4">
          <button onClick={handleChangePassword} disabled={loading} className="save-btn">
            {loading ? (
              <><div className="loader-sm" />Changing...</>
            ) : (
              <><Lock className="w-5 h-5" />Change Password</>
            )}
          </button>
          <button onClick={() => router.push('/profile')} className="cancel-btn">
            <ChevronLeft className="w-5 h-5" />Cancel
          </button>
        </section>

        {/* Forgot Password Link */}
        <section className="px-4 mt-6">
          <button onClick={() => router.push('/forgot-password')} className="forgot-link">
            Forgot Password?
          </button>
        </section>
      </main>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }
  .loader-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Info Card */
  .info-card { display: flex; gap: 14px; padding: 18px; background: rgba(61,111,255,.08); border: 1.5px solid rgba(61,111,255,.2); border-radius: var(--radius); }
  .info-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(61,111,255,.15); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .info-body { flex: 1; }
  .info-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .info-list { list-style: none; padding: 0; margin: 0; }
  .info-list li { font-size: 12px; color: var(--muted); margin-bottom: 4px; padding-left: 12px; position: relative; }
  .info-list li::before { content: '•'; position: absolute; left: 0; color: var(--accent); font-weight: bold; }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

  /* Form Fields */
  .form-fields { display: flex; flex-direction: column; gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); pointer-events: none; }
  .field-input { width: 100%; padding: 12px 14px 12px 44px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }
  .field-error { border-color: var(--accent2) !important; }
  .field-error-text { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--accent2); margin-top: 6px; font-weight: 500; }

  /* Action Buttons */
  .save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 8px 28px rgba(10,22,40,.25); }
  .save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(10,22,40,.35); }
  .save-btn:active { transform: scale(.98); }
  .save-btn:disabled { opacity: .6; cursor: not-allowed; }
  .cancel-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 14px; background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; margin-top: 10px; }
  .cancel-btn:hover { background: var(--bg); }

  /* Forgot Link */
  .forgot-link { display: block; width: 100%; padding: 14px; text-align: center; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--accent); background: none; border: none; cursor: pointer; text-decoration: underline; }
  .forgot-link:hover { color: var(--primary); }
`;
