'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { profileAPIExtended } from '@/lib/api/extended';
import { User, Mail, Phone, Camera, Save, ArrowRight, ChevronLeft } from 'lucide-react';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    gender: user?.gender || 'male',
  });

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.mobile) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await profileAPIExtended.updateProfile({
        user_id: user.id,
        ...formData,
      });

      updateUser({
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender,
      });

      alert('Profile updated successfully!');
      router.push('/profile');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Edit Profile" />

      <main className="w-full">
        {/* Profile Picture */}
        <section className="px-4 mt-4">
          <div className="profile-pic-card">
            <div className="profile-pic-wrap">
              <div className="profile-pic">
                <User className="w-12 h-12" />
              </div>
              <button className="camera-btn">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="profile-pic-name">{user.first_name} {user.last_name}</h3>
            <p className="profile-pic-email">{user.email}</p>
          </div>
        </section>

        {/* Personal Information */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">Personal Information</h3>

            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">First Name *</label>
                <div className="field-wrap">
                  <User className="field-icon" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="field-input"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Last Name *</label>
                <div className="field-wrap">
                  <User className="field-icon" />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Email *</label>
              <div className="field-wrap">
                <Mail className="field-icon" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Mobile *</label>
              <div className="field-wrap">
                <Phone className="field-icon" />
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Gender</label>
              <div className="gender-grid">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`gender-btn ${formData.gender === gender ? 'gender-active' : ''}`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-4 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="save-btn">
            {loading ? (
              <><div className="loader-sm" />Saving...</>
            ) : (
              <><Save className="w-5 h-5" />Save Changes</>
            )}
          </button>
          <button onClick={() => router.push('/profile')} className="cancel-btn">
            <ChevronLeft className="w-5 h-5" />Cancel
          </button>
        </section>

        {/* Account Settings */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">Account Settings</h3>
            <div className="settings-list">
              <button
                onClick={() => router.push('/profile/change-password')}
                className="settings-item"
              >
                <span className="settings-label">Change Password</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/addresses')}
                className="settings-item"
              >
                <span className="settings-label">Manage Addresses</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
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

  /* Profile Picture Card */
  .profile-pic-card { background: var(--surface); border-radius: var(--radius); padding: 24px 20px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .profile-pic-wrap { position: relative; display: inline-block; margin-bottom: 12px; }
  .profile-pic { width: 88px; height: 88px; border-radius: 50%; background: rgba(10,22,40,.06); display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto; }
  .camera-btn { position: absolute; bottom: 2px; right: 2px; width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all .2s; }
  .camera-btn:hover { background: var(--accent); transform: scale(1.05); }
  .profile-pic-name { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: var(--primary); margin-bottom: 4px; }
  .profile-pic-email { font-size: 13px; color: var(--muted); }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

  /* Form Fields */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); pointer-events: none; }
  .field-input { width: 100%; padding: 12px 14px 12px 44px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }

  /* Gender Selection */
  .gender-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .gender-btn { padding: 14px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; text-transform: capitalize; }
  .gender-btn:hover { border-color: rgba(61,111,255,.4); }
  .gender-active { background: rgba(61,111,255,.08); border-color: var(--accent); color: var(--accent); }

  /* Action Buttons */
  .save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 8px 28px rgba(10,22,40,.25); }
  .save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(10,22,40,.35); }
  .save-btn:active { transform: scale(.98); }
  .save-btn:disabled { opacity: .6; cursor: not-allowed; }
  .cancel-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 14px; background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; margin-top: 10px; }
  .cancel-btn:hover { background: var(--bg); }

  /* Settings List */
  .settings-list { display: flex; flex-direction: column; gap: 8px; }
  .settings-item { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 14px 16px; background: var(--bg); border: none; border-radius: 12px; cursor: pointer; transition: all .2s; text-align: left; }
  .settings-item:hover { background: rgba(10,22,40,.06); }
  .settings-label { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); }
`;
