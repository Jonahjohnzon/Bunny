'use client';
import { useState } from 'react';
import { avatarColors } from '../../Interfaces/lib/utils';
import { useRouter } from 'nextjs-toploader/app';

interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
  xxl:'w-36 h-36 text-3xl'
};

export default function Avatar({ name, src, size = 'sm' }: AvatarProps) {
  const router = useRouter()
  const [imgFailed, setImgFailed] = useState(false);
  const letter = name?.trim().charAt(0).toUpperCase() || '?';
  const bg = avatarColors[letter] ?? '#4b8ef1';
  const sz = sizeClasses[size];

  const showImage = !!src && !imgFailed;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setImgFailed(true)}
        className={`${sz} rounded-full object-cover shrink-0 cursor-pointer`}
        onClick={()=>{
          router.push(`/u/${name}`)
        }}
      />
    );
  }

  return (
    <div
      className={`${sz} rounded-full flex items-center cursor-pointer justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: bg }}
      onClick={()=>{
          router.push(`/u/${name}`)
      }}
    >
      {letter}
    </div>
  );
}