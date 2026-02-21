'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { User, MapPin, Bell, CreditCard, HelpCircle, LogOut, Settings, Globe, Shield, FileText, ShoppingBag } from 'lucide-react';
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
      <div className="min-h-screen bg-screenback pb-20">
        <Header title="Profile" />
        
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Welcome to Kafek</h2>
            <p className="text-greyunselect mb-6">Login to access your profile</p>
            <div className="space-x-3">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </Card>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title={language === 'ar' ? 'الملف الشخصي' : language === 'ur' ? 'پروفائل' : 'Profile'} />

      <main className="max-w-screen-xl mx-auto">
        {/* Profile Header */}
        <div className="bg-primary text-white px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              {user.image ? (
                <img
                  src={`${API_CONFIG.IMAGE_BASE_URL}${user.image}`}
                  alt={user.first_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-white/80 text-sm">{user.email}</p>
              <p className="text-white/80 text-sm">{user.mobile_with_code}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wallet Balance */}
        <Card className="mx-4 mt-4 bg-gradient-to-r from-button to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-3xl font-bold mt-1">{user.wallet || '0.00'} SAR</p>
            </div>
            <CreditCard className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        {/* Menu Items */}
        <div className="mx-4 mt-4 space-y-2">
          {menuItems.filter(item => item.show !== false).map((item, index) => {
            const Icon = item.icon;
            const Content = (
              <Card className="flex items-center justify-between py-3 px-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="text-sm text-greyunselect">{item.badge} SAR</span>
                  )}
                  <svg className="w-5 h-5 text-greyunselect" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            );

            // If item has an action, use button instead of Link
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

        {/* Language Selection */}
        <Card className="mx-4 mt-4">
          <h3 className="font-bold text-primary mb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            {language === 'ar' ? 'اللغة / Language' : language === 'ur' ? 'زبان / Language' : 'Language / اللغة'}
          </h3>
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  language === lang.code
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-greyunselect hover:bg-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          {language === 'ar' && (
            <p className="text-xs text-greyunselect mt-2 text-right" dir="rtl">
              تم تغيير اللغة بنجاح!
            </p>
          )}
          {language === 'ur' && (
            <p className="text-xs text-greyunselect mt-2 text-right" dir="rtl">
              زبان کامیابی سے تبدیل ہو گئی!
            </p>
          )}
          {language === 'en' && (
            <p className="text-xs text-greyunselect mt-2">
              Language changed successfully!
            </p>
          )}
        </Card>

        {/* Logout Button */}
        <div className="mx-4 mt-6 mb-8">
          <Button
            variant="outline"
            fullWidth
            onClick={handleLogout}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
