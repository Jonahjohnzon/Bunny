// RegisterPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import AuthLayout from '../../Panel/AuthLayout';
import { useRouter } from "nextjs-toploader/app";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthService } from '@/app/services/auth';

const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'At least 3 characters')
    .max(30, 'Max 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'At least 8 characters'),
  confirm: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms'),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [serverError, setServerError]   = useState('');
  const [success, setSuccess]           = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', confirm: '', terms: false },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const res = await AuthService.register({
          username: values.username,
          email:    values.email,
          password: values.password,
        });
        if (res.success) {
          setSuccess(true);
          setTimeout(() => router.replace('/'), 1200);
        } else {
          setServerError((res as any).message ?? 'Registration failed.');
        }
      } catch (err: any) {
        setServerError(typeof err === 'string' ? err : 'An error occurred.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldError = (key: keyof typeof formik.errors) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : null;

  const inputClass = (key: keyof typeof formik.errors) =>
    `w-full bg-[#1b1c1f] border rounded-lg py-3 text-sm font-medium text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none transition-colors
    ${fieldError(key) ? 'border-[#ef4444]' : 'border-[rgba(255,255,255,0.08)] focus:border-[#4b8ef1]'}`;

  if (success) {
    return (
      <AuthLayout title="You're in!" subtitle="Account created successfully." footer={<p></p>}>
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-[#10b981]" />
          </div>
          <p className="text-sm font-medium text-[#8a8d91]">Redirecting you now...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the Bunny Forum community — it only takes a minute."
      footer={
        <p className="text-sm text-[#8a8d91]">
          Already a member?{' '}
          <button
            onClick={() => router.replace("/auth/login")}
            className="text-[#4b8ef1] hover:underline font-semibold"
          >
            Log in
          </button>
        </p>
      }
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5" noValidate>

        {/* Server error */}
        {serverError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg">
            <AlertCircle size={16} className="text-[#ef4444] shrink-0" />
            <p className="text-sm font-medium text-[#ef4444]">{serverError}</p>
          </div>
        )}

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label htmlFor="reg-username" className="text-sm font-semibold text-[#a8b3cf]">Username</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50]" />
            <input
              id="reg-username"
              type="text"
              autoComplete="username"
              placeholder="Pick a username"
              {...formik.getFieldProps('username')}
              className={`${inputClass('username')} pl-10 pr-4`}
            />
          </div>
          {fieldError('username') && <p className="text-xs font-medium text-[#ef4444]">{fieldError('username')}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="reg-email" className="text-sm font-semibold text-[#a8b3cf]">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50]" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...formik.getFieldProps('email')}
              className={`${inputClass('email')} pl-10 pr-4`}
            />
          </div>
          {fieldError('email') && <p className="text-xs font-medium text-[#ef4444]">{fieldError('email')}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="reg-password" className="text-sm font-semibold text-[#a8b3cf]">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50]" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...formik.getFieldProps('password')}
              className={`${inputClass('password')} pl-10 pr-10`}
            />
            <button type="button" onClick={() => setShowPassword(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50] hover:text-[#8a8d91] transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldError('password') && <p className="text-xs font-medium text-[#ef4444]">{fieldError('password')}</p>}
        </div>

        {/* Confirm */}
        <div className="flex flex-col gap-2">
          <label htmlFor="reg-confirm" className="text-sm font-semibold text-[#a8b3cf]">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50]" />
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              {...formik.getFieldProps('confirm')}
              className={`${inputClass('confirm')} pl-10 pr-10`}
            />
            <button type="button" onClick={() => setShowConfirm(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4b50] hover:text-[#8a8d91] transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldError('confirm') && <p className="text-xs font-medium text-[#ef4444]">{fieldError('confirm')}</p>}
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-3 text-sm font-medium text-[#8a8d91] cursor-pointer select-none">
            <input
              type="checkbox"
              {...formik.getFieldProps('terms')}
              checked={formik.values.terms}
              className="w-4 h-4 mt-0.5 rounded border-[rgba(255,255,255,0.15)] bg-[#1b1c1f] accent-[#4b8ef1] shrink-0"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-[#4b8ef1] hover:underline font-semibold">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#4b8ef1] hover:underline font-semibold">Privacy Policy</a>
            </span>
          </label>
          {fieldError('terms') && <p className="text-xs font-medium text-[#ef4444]">{fieldError('terms')}</p>}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#4b8ef1] hover:bg-[#3a7de0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg py-3 transition-colors mt-1"
        >
          <UserPlus size={16} />
          {formik.isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}