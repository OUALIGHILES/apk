'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

interface SignupForm {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
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
      setLoading(true);
      setError('');

      const response = await authAPI.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile: data.mobile,
        mobile_with_code: data.mobile,
        password: data.password,
        gender: data.gender,
        type: 'USER',
      });

      if (response.status === 'success' && response.result) {
        setUser(response.result);
        setToken(response.result.token);
        localStorage.setItem('user_id', response.result.id);
        router.push('/');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="max-w-md mx-auto px-4">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                <span className="text-3xl font-bold text-primary">K</span>
              </div>
            </Link>
          </div>
        </div>

        <main className="max-w-md mx-auto px-4 pb-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/80 text-lg">Join Kafek and start your journey</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    label="First Name *"
                    type="text"
                    placeholder="First name"
                    icon={<User className="w-5 h-5" />}
                    className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register('first_name', { required: 'First name is required' })}
                    error={errors.first_name?.message}
                  />
                </div>
                <div>
                  <Input
                    label="Last Name *"
                    type="text"
                    placeholder="Last name"
                    className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register('last_name', { required: 'Last name is required' })}
                    error={errors.last_name?.message}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="w-5 h-5" />}
                  className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email?.message}
                />
              </div>

              {/* Mobile */}
              <div>
                <Input
                  label="Mobile Number *"
                  type="tel"
                  placeholder="Enter your mobile number"
                  icon={<Phone className="w-5 h-5" />}
                  className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register('mobile', { required: 'Mobile number is required' })}
                  error={errors.mobile?.message}
                />
              </div>

              {/* Gender & Password Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                    />
                    <span className="ml-2 text-sm text-gray-600">Show password</span>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div>
                <Input
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  icon={<Lock className="w-5 h-5" />}
                  className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Input
                  label="Confirm Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  icon={<Lock className="w-5 h-5" />}
                  className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register('confirm_password', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  error={errors.confirm_password?.message}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                fullWidth 
                loading={loading} 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">Already have an account?</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-primary font-bold hover:underline transition-all"
              >
                <span>Sign In Here</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Why join Kafek?</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Order from your favorite stores</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Track your orders in real-time</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Exclusive offers and discounts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-xs">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-white">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
