'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { profileAPIExtended } from '@/lib/api/extended';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';

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

      // Update local state
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
    <div className="min-h-screen bg-screenback">
      <Header title="Edit Profile" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Profile Picture */}
        <Card className="mb-4 text-center py-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-12 h-12 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <h3 className="font-bold text-primary text-lg">{user.first_name} {user.last_name}</h3>
          <p className="text-sm text-greyunselect">{user.email}</p>
        </Card>

        {/* Edit Form */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name *"
                placeholder="First name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                label="Last Name *"
                placeholder="Last name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                icon={<User className="w-5 h-5" />}
              />
            </div>

            <Input
              label="Email *"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Mobile *"
              type="tel"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              icon={<Phone className="w-5 h-5" />}
            />

            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                      formData.gender === gender
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        {/* Additional Options */}
        <Card className="mt-4">
          <h3 className="font-bold text-primary mb-3">Account Settings</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/profile/change-password')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">Change Password</span>
              <ArrowRight className="w-5 h-5 text-greyunselect" />
            </button>
            <button
              onClick={() => router.push('/addresses')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">Manage Addresses</span>
              <ArrowRight className="w-5 h-5 text-greyunselect" />
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}

// Missing ArrowRight import
import { ArrowRight } from 'lucide-react';
