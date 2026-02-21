'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
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
      
      console.log('Signing up with:', {
        ...data,
        password: '***'
      });
      
      const response = await authAPI.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile: data.mobile,
        mobile_with_code: data.mobile, // Use same mobile number
        password: data.password,
        gender: data.gender,
        type: 'USER',
      });
      
      console.log('Signup response:', response);
      
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
    <div className="min-h-screen bg-screenback">
      <Header title="Sign Up" />
      
      <main className="max-w-md mx-auto px-4 py-8">
        <Card className="mt-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Create Account</h1>
            <p className="text-greyunselect mt-2">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                type="text"
                placeholder="First name"
                icon={<User className="w-5 h-5" />}
                {...register('first_name', { required: 'First name is required' })}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Last name"
                {...register('last_name', { required: 'Last name is required' })}
                error={errors.last_name?.message}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="Enter your mobile number"
              icon={<Phone className="w-5 h-5" />}
              {...register('mobile', { required: 'Mobile number is required' })}
              error={errors.mobile?.message}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-2.5 bg-editback border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
              <div className="pt-7">
                {/* Spacer for alignment */}
              </div>
            </div>

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              icon={<Lock className="w-5 h-5" />}
              {...register('confirm_password', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={errors.confirm_password?.message}
            />

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign Up
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-greyunselect">
            Already have an account?{' '}
            <Link href="/login" className="text-button font-medium">
              Login
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
