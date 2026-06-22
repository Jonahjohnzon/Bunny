'use client';
import { Edit3, MessageSquare } from 'lucide-react';
import {  StatPill } from '../ui';
import { UserProfile } from '../../types';
import { FileText, ThumbsUp, Calendar } from 'lucide-react';
import Avatar from '@/app/MainPage/trendingThreads/components/Avatar';
import { formatTimeAgo } from '@/app/n/component/utils';
import { useRouter } from 'nextjs-toploader/app';
import { MessageService } from '@/app/services/messages';
import { useState } from 'react';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
  total:number
}

export function ProfileHeader({ profile, onEdit, total }: ProfileHeaderProps) {
  const router = useRouter()
  const [messaging, setMessaging] = useState(false);
  return (
    <>
      {/* Banner */}
      <div className="h-48 bg-linear-to-br from-[#1a2236] via-[#1b2640] to-[#1b1c1f] relative">
        <div
          className="absolute inset-0 opacity-100 bg-cover  bg-center"
          style={{
            backgroundImage: profile?.banner
              ? `url(${profile.banner})`
              : 'radial-gradient(circle at 30% 50%, #4b8ef133 0%, transparent 60%), radial-gradient(circle at 70% 30%, #10b98133 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-10 mb-5 relative z-10">
          <div className="flex items-end gap-4">
            <div className=' border-2 border-black rounded-full'>
            <Avatar name={profile.username} src={profile.avatar} size={"xxl"} />
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#e4e6eb] leading-none">{profile.username}</h1>
                {profile.isOnline ? (
                  <span className="flex items-center gap-1 bg-[#242528] rounded-lg border  border-[rgba(255,255,255,0.06)] px-4 py-1  text-[12px] text-[#10b981] ">
                    <div className="w-1.5 h-1.5  rounded-full bg-[#10b981] animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="text-[12px] bg-[#242528] rounded-lg border  border-[rgba(255,255,255,0.06)] px-4 py-1  text-[#e6e6eb]">{`Last seen - ${formatTimeAgo(profile.lastSeenAt)}`}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded"
                  style={{ color: profile.role.color, backgroundColor: profile.role.color + '18' }}
                >
                  {profile.role.name}
                </span>
                <span className="text-base text-[#d7d8df]">{profile.customTitle}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-1">
            {profile.isOwnProfile ? (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#242528] border border-[rgba(255,255,255,0.08)] hover:border-[#4b8ef1] text-[#e4e6eb] text-sm font-medium rounded-md transition-colors"
              >
                <Edit3 size={12} /> Edit profile
              </button>
            ) : (
              <>
                <button  
                  disabled={messaging}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4b8ef1] hover:bg-[#3a7de0] cursor-pointer text-white text-base font-semibold rounded-md transition-colors disabled:opacity-50" 
                  onClick={async () => {
                    setMessaging(true);
                    try {
                      const res = await MessageService.send({ recipientId: profile._id, content: '👋' });
                      router.push(`/messages/${res.data.conversationId}`);
                    } catch (err) {
                      console.error('Failed to start conversation', err);
                    } finally {
                      setMessaging(false);
                    }
                  }}>
                    {messaging 
                    ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Starting…</>
                    : <><MessageSquare size={13} />Message</>
                  }
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
          <StatPill icon={<FileText size={13} />} label="Posts" value={profile.postCount.toLocaleString()} />
          <StatPill icon={<MessageSquare size={13} />} label="Threads" value={total} />
          <StatPill icon={<ThumbsUp size={13} />} label="Reputation" value={profile.reputation} />
          <StatPill icon={<Calendar size={13} />} label="Joined" value={formatTimeAgo(profile.createdAt)} />
        </div>
      </div>
    </>
  );
}