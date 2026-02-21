'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

interface LoginForm {
  mobile: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.login(data.mobile, data.password, 'USER');

      if (response.status === 'success' && response.result) {
        setUser(response.result);
        setToken(response.result.token);
        localStorage.setItem('user_id', response.result.id);
        router.push('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    // Implement Firebase social login here
    console.log('Social login with:', provider);
  };

  return (
    <div className="min-h-screen bg-screenback">
      <Header title="Login" />
      
      <main className="max-w-md mx-auto px-4 py-8">
        <Card className="mt-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
            <p className="text-greyunselect mt-2">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="Enter your mobile number"
              icon={<Phone className="w-5 h-5" />}
              {...register('mobile', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/i,
                  message: 'Please enter a valid mobile number',
                },
              })}
              error={errors.mobile?.message}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-button font-medium">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Login
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-greyunselect">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('google')}
              className="border-facebook text-facebook"
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('facebook')}
              className="border-facebook text-facebook"
            >
              Continue with Facebook
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-greyunselect">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-button font-medium">
              Sign Up
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
