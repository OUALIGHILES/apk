'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { User, MapPin, Bell, CreditCard, HelpCircle, LogOut, Settings, Globe, Shield, FileText, ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });

  const menuItems = [
    { icon: User, label: language === 'ar' ? 'تعديل الملف الشخصي' : language === 'ur' ? 'پروفائل میں ترمیم' : 'Edit Profile', href: '/profile/edit', show: !!user },
    { icon: MapPin, label: language === 'ar' ? 'عناويني' : language === 'ur' ? 'میرے پتے' : 'My Addresses', href: '/addresses', show: !!user },
    { icon: CreditCard, label: language === 'ar' ? 'المحفظة' : language === 'ur' ? 'والیٹ' : 'Wallet', href: '/wallet', show: !!user, badge: user?.wallet || '0' },
    { icon: Bell, label: language === 'ar' ? 'الإشعارات' : language === 'ur' ? 'اطلاعات' : 'Notifications', href: '/notifications', show: !!user },
    { icon: Settings, label: language === 'ar' ? 'الطلبات' : language === 'ur' ? 'آرڈرز' : 'Orders', href: '/orders', show: !!user },
    { icon: HelpCircle, label: language === 'ar' ? 'المساعدة والدعم' : language === 'ur' ? 'مدد اور سپورٹ' : 'Help & Support', href: '/support' },
    { icon: Shield, label: language === 'ar' ? 'سياسة الخصوصية' : language === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy', href: '/privacy' },
    { icon: FileText, label: language === 'ar' ? 'الشروط والأحكام' : language === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions', href: '/terms' },
    { icon: Globe, label: language === 'ar' ? 'اللغة' : language === 'ur' ? 'زبان' : 'Language', action: () => setShowLanguagePicker(true) },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const languages: { code: 'en' | 'ar' | 'ur'; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'ur', label: 'اردو' },
  ];

  if (!user) {
    return (
      <div className="page-root pb-24">
        <style>{css}</style>
        <Header title="Profile" />

        <main className="w-full">
          <div className="empty-full">
            <div className="profile-avatar-large">
              <User className="w-12 h-12" />
            </div>
            <h2 className="empty-title">Welcome to Kafek</h2>
            <p className="empty-sub">Login to access your profile</p>
            <div className="auth-buttons">
              <Link href="/login" className="pill-btn-outline">Login</Link>
              <Link href="/signup" className="pill-btn">Sign Up</Link>
            </div>
          </div>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title={language === 'ar' ? 'الملف الشخصي' : language === 'ur' ? 'پروفائل' : 'Profile'} />

      <main className="w-full">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {user.image ? (
                <img
                  src={`${API_CONFIG.IMAGE_BASE_URL}${user.image}`}
                  alt={user.first_name}
                  className="avatar-img"
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">
                {user.first_name} {user.last_name}
              </h2>
              <p className="profile-email">{user.email}</p>
              <p className="profile-phone">{user.mobile_with_code}</p>
            </div>
            <button onClick={() => setEditing(!editing)} className="edit-btn">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Wallet Balance */}
        <section className="px-4 mt-4">
          <div className="wallet-card">
            <div>
              <p className="wallet-label">Wallet Balance</p>
              <p className="wallet-amount">{user.wallet || '0.00'} SAR</p>
            </div>
            <CreditCard className="w-12 h-12 wallet-icon" />
          </div>
        </section>

        {/* Menu Items */}
        <section className="px-4 mt-4">
          <div className="menu-list">
            {menuItems.filter(item => item.show !== false).map((item, index) => {
              const Icon = item.icon;
              const Content = (
                <div className="menu-item">
                  <div className="menu-left">
                    <div className="menu-icon">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="menu-label">{item.label}</span>
                  </div>
                  <div className="menu-right">
                    {item.badge && (
                      <span className="menu-badge">{item.badge} SAR</span>
                    )}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );

              if (item.action) {
                return (
                  <button key={index} onClick={item.action} className="w-full">
                    {Content}
                  </button>
                );
              }

              return (
                <Link key={index} href={item.href} className="block">
                  {Content}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Language Selection */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">
              <Globe className="w-5 h-5" />
              {language === 'ar' ? 'اللغة / Language' : language === 'ur' ? 'زبان / Language' : 'Language / اللغة'}
            </h3>
            <div className="lang-strip">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`lang-btn ${language === lang.code ? 'lang-active' : ''}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            {language === 'ar' && (
              <p className="lang-success text-right" dir="rtl">
                تم تغيير اللغة بنجاح!
              </p>
            )}
            {language === 'ur' && (
              <p className="lang-success text-right" dir="rtl">
                زبان کامیابی سے تبدیل ہو گئی!
              </p>
            )}
            {language === 'en' && (
              <p className="lang-success">
                Language changed successfully!
              </p>
            )}
          </div>
        </section>

        {/* Logout Button */}
        <section className="px-4 mt-6 mb-8">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </section>
      </main>

      <BottomNavigation />
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

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .profile-avatar-large{width:96px;height:96px;border-radius:50%;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:var(--primary)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .auth-buttons{display:flex;gap:10px;margin-top:24px}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;text-decoration:none}
  .pill-btn-outline{padding:12px 28px;background:transparent;color:var(--primary);border:2px solid var(--primary);border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;text-decoration:none}

  /* Profile Header */
  .profile-header { background: var(--primary); padding: 24px 20px; }
  .profile-header-content { display: flex; align-items: center; gap: 16px; }
  .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; overflow: hidden; }
  .avatar-img { width: 100%; height: 100%; object-fit: cover; }
  .profile-info { flex: 1; }
  .profile-name { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .profile-email { font-size: 13px; color: rgba(255,255,255,.75); margin-bottom: 2px; }
  .profile-phone { font-size: 13px; color: rgba(255,255,255,.75); }
  .edit-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,.15); color: #fff; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all .2s; flex-shrink: 0; }
  .edit-btn:hover { background: rgba(255,255,255,.25); }

  /* Wallet Card */
  .wallet-card { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: linear-gradient(135deg, var(--green) 0%, #0A8A58 100%); border-radius: var(--radius); color: #fff; box-shadow: 0 8px 24px rgba(29,184,122,.25); }
  .wallet-label { font-size: 13px; opacity: .9; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
  .wallet-amount { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; }
  .wallet-icon { opacity: .3; }

  /* Menu List */
  .menu-list { display: flex; flex-direction: column; gap: 8px; }
  .menu-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; background: var(--surface); border-radius: var(--radius); box-shadow: 0 1px 4px rgba(0,0,0,.05); cursor: pointer; transition: all .2s; border: none; width: 100%; text-align: left; }
  .menu-item:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-1px); }
  .menu-left { display: flex; align-items: center; gap: 12px; }
  .menu-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(10,22,40,.06); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
  .menu-label { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--primary); }
  .menu-right { display: flex; align-items: center; gap: 8px; color: var(--muted); }
  .menu-badge { font-size: 12px; font-weight: 600; color: var(--muted); }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 14px; }

  /* Language Strip */
  .lang-strip { display: flex; gap: 8px; }
  .lang-btn { flex: 1; padding: 12px 16px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; }
  .lang-btn:hover { border-color: rgba(61,111,255,.4); }
  .lang-active { background: var(--primary); border-color: var(--primary); color: #fff; }
  .lang-success { font-size: 12px; color: var(--green); margin-top: 10px; font-weight: 500; }

  /* Logout Button */
  .logout-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: rgba(255,92,58,.08); border: 1.5px solid rgba(255,92,58,.2); border-radius: var(--radius); color: var(--accent2); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .logout-btn:hover { background: rgba(255,92,58,.15); }
`;
