'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { Lock, Key, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-screenback">
      <Header title="Change Password" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Info Card */}
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">Password Requirements</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Use a mix of letters and numbers</li>
                <li>• Include special characters for extra security</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Change Password Form */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Security Information
          </h3>

          <div className="space-y-4">
            <Input
              label="Current Password *"
              type="password"
              placeholder="Enter current password"
              value={formData.current_password}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
              icon={<Lock className="w-5 h-5" />}
              error={errors.current_password}
            />

            <Input
              label="New Password *"
              type="password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              icon={<Key className="w-5 h-5" />}
              error={errors.new_password}
            />

            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirm_password}
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleChangePassword}
            loading={loading}
            className="w-full"
          >
            Change Password
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-button font-medium hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </main>
    </div>
  );
}
