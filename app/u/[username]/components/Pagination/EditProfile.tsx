'use client';
import { useState } from 'react';
import { X, Save, Check, User, Settings, Loader2 } from 'lucide-react';
import { ProfileTab, AccountTab, AppearanceTab, NotificationsTab } from './EditTabs';
import { UserService } from '@/app/services/users';
import { UserProfile, EditTab } from '../../types';

interface EditProfileProps {
  profile: UserProfile;
  onCancel: () => void;
  onSaved?: () => void;
}

export interface ProfileFormData {
  customTitle: string;
  bio: string;
  location: string;
  website: string;
  link: string;
  signature: string;
  avatar?: string;
  banner?:string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const TABS: { id: EditTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',       icon: <User size={13} />     },
  { id: 'account',       label: 'Account',       icon: <Settings size={13} /> },
  // { id: 'appearance',    label: 'Appearance',    icon: <Palette size={13} />  },
  // { id: 'notifications', label: 'Notifications', icon: <Bell size={13} />     },
];

export function EditProfile({ profile, onCancel, onSaved }: EditProfileProps) {
  const [tab, setTab] = useState<EditTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    customTitle: profile.customTitle ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    website: profile.socials?.website ?? '',
    link: profile.socials?.link ?? '',
    signature: profile.signature ?? '',
    avatar:profile.avatar ?? '',
    banner:profile.banner ?? ''
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  const [themeId, setThemeId] = useState('dark-default');

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      if (tab === 'profile') {
        await UserService.updateProfile({
          customTitle: formData.customTitle,
          bio: formData.bio,
          location: formData.location,
          signature: formData.signature,
          socials: { website: formData.website, link: formData.link },
          avatar:formData.avatar,
          banner:formData.banner
        });
        onSaved?.();
        flashSaved();
      } else if (tab === 'account') {
        const touchedPassword =
          passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;

        if (touchedPassword) {
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match.');
            return;
          }
          if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters.');
            return;
          }
          await UserService.changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          });
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
        flashSaved();
      } else if (tab === 'appearance') {
        await UserService.updateTheme(themeId);
        flashSaved();
      } else {
        // No backend endpoint for notification prefs yet — local-only for now
        flashSaved();
      }
    } catch  {
      setError('Could not save changes. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1c1f]">
      <div className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.06)] bg-[#242528]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2d2e32] text-[#8a8d91] hover:text-[#e4e6eb] transition-colors"
          >
            <X size={16} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#e4e6eb]">Edit Profile</h1>
            <p className="text-[10px] text-[#4a4b50]">
              {error ? <span className="text-[#ef4444]">{error}</span> : 'Changes are saved per section'}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 disabled:opacity-60 ${saved ? 'bg-[#10b981] text-white' : 'bg-[#4b8ef1] hover:bg-[#3a7de0] text-white'}`}
          >
            {saving ? (
              <><Loader2 size={12} className="animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check size={12} /> Saved</>
            ) : (
              <><Save size={12} /> Save changes</>
            )}
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex gap-0.5 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${tab === t.id ? 'border-[#4b8ef1] text-[#4b8ef1]' : 'border-transparent text-[#8a8d91] hover:text-[#e4e6eb]'}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'profile' && (
          <ProfileTab profile={profile} formData={formData} onChange={setFormData} />
        )}
        {tab === 'account' && (
          <AccountTab profile={profile} passwordData={passwordData} onPasswordChange={setPasswordData} />
        )}
        {tab === 'appearance' && (
          <AppearanceTab themeId={themeId} onThemeChange={setThemeId} />
        )}
        {tab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}