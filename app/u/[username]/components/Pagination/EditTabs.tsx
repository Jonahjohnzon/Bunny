'use client';
import { useState } from 'react';
import { Camera, Eye, EyeOff, AlertTriangle, Check, MapPin, Globe, Bird, GitFork } from 'lucide-react';
import {  Field, Toggle, SectionCard } from '../ui';
import { themes } from '../../data/mockData';
import { UserProfile } from '../../types';
import { ProfileFormData, PasswordFormData } from './EditProfile';
import Avatar from '@/app/MainPage/trendingThreads/components/Avatar';

// ── Profile Tab ───────────────────────────────────────────────────────────────
interface ProfileTabProps {
  profile: UserProfile;
  formData: ProfileFormData;
  onChange: (data: ProfileFormData) => void;
}

export function ProfileTab({ profile, formData, onChange }: ProfileTabProps) {
  const set = (key: keyof ProfileFormData) => (value: string) =>
  {
    onChange({ ...formData, [key]: value });
  } 




  return (
    <div className="space-y-4">
<SectionCard title="Avatar & Banner">
  <div className="p-4 flex flex-col sm:flex-row gap-6">
    <div className="flex flex-col items-center gap-2 w-full sm:w-56">
      <div className=' border-3 border-black rounded-full'>
      <Avatar name={profile?.username} src={profile?.avatar} size={'xl'} />
      </div>
      <div className="w-full space-y-2">
        <Field
          label="Avatar image URL"
          value={formData?.avatar}
          onChange={set('avatar')}
          placeholder="https://example.com/avatar.png"
          icon={<Camera size={12} />}
          hint="Paste a direct link to an image."
        />
      </div>
    </div>
          <div className="w-full space-y-2">
        <Field
          label="Banner image URL"
          value={formData?.banner}
          onChange={set('banner')}
          placeholder="https://example.com/banner.png"
          icon={<Camera size={12} />}
          hint="Paste a direct link to an image."
        />
      </div>
  </div>
</SectionCard>

      <SectionCard title="Basic Info">
        <div className="p-4 space-y-4">
          <Field label="Custom title" value={formData.customTitle} onChange={set('customTitle')} placeholder="e.g. Senior Member, Power User..." hint="Shown below your username on posts." />
          <Field label="Bio" value={formData.bio} onChange={set('bio')} placeholder="Tell the community about yourself..." multiline hint="Max 500 characters." />
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Website" value={formData?.website} onChange={set('website')} placeholder="https://... your site" icon={<Globe size={12} />} />
          <Field label="Link" value={formData?.link} onChange={set('link')} placeholder="https://social..." icon={<MapPin size={12} />} />
        </div>
      </SectionCard>

      <SectionCard title="Signature">
        <div className="p-4">
          <Field label="Signature" value={formData.signature} onChange={set('signature')} placeholder="Shown at the bottom of your posts..." multiline hint="Keep it short. Max 200 characters." />
        </div>
      </SectionCard>
    </div>
  );
}

// ── Account Tab ───────────────────────────────────────────────────────────────
interface AccountTabProps {
  profile: UserProfile;
  passwordData: PasswordFormData;
  onPasswordChange: (data: PasswordFormData) => void;
}

export function AccountTab({ profile, passwordData, onPasswordChange }: AccountTabProps) {
  const [showPassword, setShowPassword] = useState(false);
  const set = (key: keyof PasswordFormData) => (value: string) =>
    onPasswordChange({ ...passwordData, [key]: value });

  return (
    <div className="space-y-4">
      <SectionCard title="Account Details">
        <div className="p-4 space-y-4">
          <Field label="Username" defaultValue={profile?.username} hint="Changing your username may confuse other members." disabled />
          <Field label="Email address" defaultValue={profile?.email} type="email" disabled />
        </div>
      </SectionCard>

      <SectionCard title="Change Password">
        <div className="p-4 space-y-4">
          <Field label="Current password" type={showPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={set('currentPassword')} placeholder="••••••••" />
          <Field label="New password" type={showPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={set('newPassword')} placeholder="••••••••" hint="Min 8 characters." />
          <Field label="Confirm new password" type={showPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" />
          <button
            onClick={() => setShowPassword(v => !v)}
            className="flex items-center gap-1.5 text-[11px] text-[#8a8d91] hover:text-[#e4e6eb] transition-colors"
          >
            {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
            {showPassword ? 'Hide' : 'Show'} passwords
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Danger Zone"
        danger
        headerExtra={<AlertTriangle size={13} className="text-[#ef4444]" />}
      >
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#e4e6eb]">Delete account</p>
            <p className="text-xs text-[#8a8d91] mt-0.5">Permanently deletes your account and all posts. Cannot be undone.</p>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-[#ef4444] border border-[#ef444440] rounded-md hover:bg-[#ef44440f] transition-colors flex-shrink-0 ml-4">
            Delete account
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Appearance Tab ────────────────────────────────────────────────────────────
interface AppearanceTabProps {
  themeId: string;
  onThemeChange: (id: string) => void;
}

export function AppearanceTab({ themeId, onThemeChange }: AppearanceTabProps) {
  const displayPrefs = [
    { label: 'Show signatures on posts', hint: 'Display other members\' signatures below their posts.', default: true },
    { label: 'Show avatars', hint: 'Show profile pictures next to posts.', default: true },
    { label: 'Compact thread view', hint: 'Reduces spacing between posts for a denser layout.', default: false },
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="Forum Theme">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {themes.map(theme => (
            <button
              key={theme?.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${themeId === theme.id ? 'border-[#4b8ef1]' : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]'}`}
            >
              <div className="h-14 flex flex-col gap-1 p-2" style={{ backgroundColor: theme.bg }}>
                <div className="h-1.5 rounded w-3/4" style={{ backgroundColor: theme.accent }} />
                <div className="h-1 rounded w-full bg-white/10" />
                <div className="h-1 rounded w-5/6 bg-white/10" />
                <div className="h-1 rounded w-2/3 bg-white/10" />
              </div>
              <div className="px-2 py-1.5 bg-[#1b1c1f] border-t border-[rgba(255,255,255,0.06)]">
                <p className="text-[10px] text-[#e4e6eb] font-medium">{theme.name}</p>
              </div>
              {themeId === theme.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#4b8ef1] flex items-center justify-center">
                  <Check size={9} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Display Preferences">
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          {displayPrefs.map((pref, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm text-[#e4e6eb]">{pref.label}</p>
                <p className="text-[11px] text-[#4a4b50] mt-0.5">{pref.hint}</p>
              </div>
              <Toggle defaultChecked={pref.default} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
export function NotificationsTab() {
  const notifications = [
    { label: 'Someone replies to your thread',  sub: 'Get notified when a member posts in a thread you started.', default: true  },
    { label: 'Someone quotes your post',         sub: 'Get notified when your post is quoted.',                   default: true  },
    { label: 'Someone reacts to your post',      sub: 'Likes, loves, and other reactions.',                       default: true  },
    { label: 'Someone mentions you',             sub: 'When your @username appears in a post.',                   default: true  },
    { label: 'You receive a direct message',     sub: 'Private messages from other members.',                     default: false },
    { label: 'Staff warnings or notices',        sub: 'Moderation actions on your account.',                      default: false },
  ];

  return (
    <SectionCard title="Notification Preferences">
      <div className="divide-y divide-[rgba(255,255,255,0.04)]">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm text-[#e4e6eb]">{n.label}</p>
              <p className="text-[11px] text-[#4a4b50] mt-0.5">{n.sub}</p>
            </div>
            <Toggle defaultChecked={n.default} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}